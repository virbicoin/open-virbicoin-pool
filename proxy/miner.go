package proxy

import (
	"log"
	"math/big"
	"strconv"
	"strings"

	"github.com/ethereum/go-ethereum/crypto"
	ethash "github.com/fedimoss/ethereum-ethash"
	"github.com/ethereum/go-ethereum/common"
)

var hasher = ethash.New()


func makeSeedHash(epoch uint64) (sh common.Hash) {
	for ; epoch > 0; epoch-- {
		sh = crypto.Keccak256Hash(sh[:])
	}
	return sh
}

func (s *ProxyServer) processShare(login, id, ip string, t *BlockTemplate, params []string) (bool, bool) {
	nonceHex := params[0]
	hashNoNonce := params[1]
	mixDigest := params[2]
	nonce, err := strconv.ParseUint(strings.Replace(nonceHex, "0x", "", -1), 16, 64)
	if err != nil {
		log.Printf("Invalid nonce format from %v@%v: %v", login, ip, nonceHex)
		return false, false
	}
	shareDiff := s.config.Proxy.Difficulty

	log.Printf("Processing share from %v@%v: nonce=%v, hashNoNonce=%v, mixDigest=%v", 
		login, ip, nonceHex, hashNoNonce, mixDigest)

	h, ok := t.headers[hashNoNonce]
	if !ok {
		log.Printf("Stale share from %v@%v: hashNoNonce %v not found in current template with %d headers", 
			login, ip, hashNoNonce, len(t.headers))
		return false, false
	}

	log.Printf("Share validation for %v@%v: height=%d, shareDiff=%d, blockDiff=%v", 
		login, ip, h.height, shareDiff, h.diff)

	share := Block{
		number:      h.height,
		hashNoNonce: common.HexToHash(hashNoNonce),
		difficulty:  big.NewInt(shareDiff),
		nonce:       nonce,
		mixDigest:   common.HexToHash(mixDigest),
	}

	block := Block{
		number:      h.height,
		hashNoNonce: common.HexToHash(hashNoNonce),
		difficulty:  h.diff,
		nonce:       nonce,
		mixDigest:   common.HexToHash(mixDigest),
	}

	if !hasher.Verify(share) {
		log.Printf("Share verification FAILED for %v@%v: nonce=%v, height=%d, shareDiff=%d", 
			login, ip, nonceHex, h.height, shareDiff)
		return false, false
	}

	log.Printf("Share verification SUCCESS for %v@%v: nonce=%v, height=%d", 
		login, ip, nonceHex, h.height)

	if hasher.Verify(block) {
		log.Printf("Block candidate found by %v@%v at height %d!", login, ip, h.height)
		ok, err := s.rpc().SubmitBlock(params)
		if err != nil {
			log.Printf("Block submission failure at height %v for %v: %v", h.height, t.Header, err)
		} else if !ok {
			log.Printf("Block rejected at height %v for %v", h.height, t.Header)
			return false, false
		} else {
			s.fetchBlockTemplate()
			exist, err := s.backend.WriteBlock(login, id, params, shareDiff, h.diff.Int64(), h.height, s.hashrateExpiration)
			if exist {
				log.Printf("Block already exists in backend for %v@%v", login, ip)
				return true, false
			}
			if err != nil {
				log.Printf("Failed to insert block candidate into backend for %v@%v: %v", login, ip, err)
			} else {
				log.Printf("Inserted block %v to backend", h.height)
			}
			log.Printf("Block found by miner %v@%v at height %d", login, ip, h.height)
		}
	} else {
		exist, err := s.backend.WriteShare(login, id, params, shareDiff, h.height, s.hashrateExpiration)
		if exist {
			log.Printf("Duplicate share detected for %v@%v: nonce=%v", login, ip, nonceHex)
			return true, false
		}
		if err != nil {
			log.Printf("Failed to insert share data into backend for %v@%v: %v", login, ip, err)
			return false, false
		}
		log.Printf("Share successfully stored for %v@%v: nonce=%v, height=%d", 
			login, ip, nonceHex, h.height)
	}
	return false, true
}
