package proxy

import (
	"bufio"
	"encoding/json"
	"errors"
	"io"
	"log"
	"math/rand"
	"net"
	"strconv"
	"strings"
	"time"

	"github.com/fedimoss/open-ethereum-pool/util"
)

const (
	MaxReqSize = 1024
)

func (s *ProxyServer) ListenTCP() {
	timeout := util.MustParseDuration(s.config.Proxy.Stratum.Timeout)
	s.timeout = timeout

	addr, err := net.ResolveTCPAddr("tcp", s.config.Proxy.Stratum.Listen)
	if err != nil {
		log.Fatalf("Error: %v", err)
	}
	server, err := net.ListenTCP("tcp", addr)
	if err != nil {
		log.Fatalf("Error: %v", err)
	}
	defer server.Close()

	log.Printf("Stratum listening on %s", s.config.Proxy.Stratum.Listen)
	var accept = make(chan int, s.config.Proxy.Stratum.MaxConn)
	n := 0

	for {
		conn, err := server.AcceptTCP()
		if err != nil {
			continue
		}
		conn.SetKeepAlive(true)

		ip, _, _ := net.SplitHostPort(conn.RemoteAddr().String())

		if s.policy.IsBanned(ip) || !s.policy.ApplyLimitPolicy(ip) {
			conn.Close()
			continue
		}
		n += 1
		// make unique extranonce
		extranonce := s.uniqExtranonce()
		//cs := &Session{conn: conn, ip: ip}
		cs := &Session{conn: conn, ip: ip, Extranonce: extranonce, ExtranonceSub: false, stratum: -1}
		// allocate stales cache
		cs.staleJobs = make(map[string]staleJob)

		accept <- n
		go func(cs *Session) {
			err = s.handleTCPClient(cs)
			if err != nil {
				s.removeSession(cs)
				conn.Close()
			}
			<-accept
		}(cs)
	}
}

func (s *ProxyServer) handleTCPClient(cs *Session) error {
	cs.enc = json.NewEncoder(cs.conn)
	connbuff := bufio.NewReaderSize(cs.conn, MaxReqSize)
	s.setDeadline(cs.conn)

	for {
		data, isPrefix, err := connbuff.ReadLine()
		if isPrefix {
			log.Printf("Socket flood detected from %s", cs.ip)
			s.policy.BanClient(cs.ip)
			return err
		} else if err == io.EOF {
			log.Printf("Client %s disconnected", cs.ip)
			s.removeSession(cs)
			break
		} else if err != nil {
			log.Printf("Error reading from socket: %v", err)
			return err
		}

		if len(data) > 1 {
			var req StratumReq
			err = json.Unmarshal(data, &req)
			if err != nil {
				s.policy.ApplyMalformedPolicy(cs.ip)
				log.Printf("Malformed stratum request from %s: %v", cs.ip, err)
				return err
			}
			s.setDeadline(cs.conn)
			err = cs.handleTCPMessage(s, &req)
			if err != nil {
				return err
			}
		}
	}
	return nil
}

func (cs *Session) handleTCPMessage(s *ProxyServer, req *StratumReq) error {
	//fmt.Println("-------------------::::" + req.Method)
	// Handle RPC methods
	switch req.Method {
	case "eth_submitLogin":
		var params []string
		err := json.Unmarshal(req.Params, &params)
		if err != nil {
			log.Println("Malformed stratum request params from", cs.ip)
			return err
		}
		reply, errReply := s.handleLoginRPC(cs, params, req.Worker)
		if errReply != nil {
			return cs.sendTCPError(req.Id, errReply)
		}
		cs.stratum = 0
		return cs.sendTCPResult(req.Id, reply)
	case "eth_getWork":
		reply, errReply := s.handleGetWorkRPC(cs)
		if errReply != nil {
			return cs.sendTCPError(req.Id, errReply)
		}
		return cs.sendTCPResult(req.Id, &reply)
	case "eth_submitWork":
		var params []string
		err := json.Unmarshal(req.Params, &params)
		if err != nil {
			log.Println("Malformed stratum request params from", cs.ip)
			return err
		}
		reply, errReply := s.handleTCPSubmitRPC(cs, req.Worker, params)
		if errReply != nil {
			return cs.sendTCPError(req.Id, errReply)
		}
		return cs.sendTCPResult(req.Id, &reply)
	case "eth_submitHashrate":
		return cs.sendTCPResult(req.Id, true)

	//Ethereum stratum mining protocol v1.0.0
	//https://www.jianshu.com/p/7bfe925f3d0a
	case "mining.subscribe":
		var params []string
		err := json.Unmarshal(req.Params, &params)
		if err != nil {
			log.Println("Unsupported stratum version from ", cs.ip)
			return cs.sendStratumError(req.Id, err)
		}

		if len(params) < 2 || params[1] != "EthereumStratum/1.0.0" {
			log.Println("Unsupported stratum version from ", cs.ip)
			return cs.sendStratumError(req.Id, "unsupported stratum version")
		}

		cs.stratum = 1
		result := cs.getNotificationResponse(s)
		return cs.sendStratumResult(req.Id, result)

	case "mining.authorize":
		var params []string
		err := json.Unmarshal(req.Params, &params)
		if err != nil || len(params) < 1 {
			return errors.New("invalid params")
		}
		splitData := strings.Split(params[0], ".")
		params[0] = splitData[0]
		reply, errReply := s.handleLoginRPC(cs, params, req.Worker)
		if errReply != nil {
			return cs.sendStratumError(req.Id, []string{
				string(errReply.Code),
				errReply.Message,
			})
		}

		if err := cs.sendStratumResult(req.Id, reply); err != nil {
			return err
		}

		/*
			reqExtranonce := JSONStratumReq{
				Id:     nil,
				Method: "mining.set_extranonce",
				Params: []interface{}{
					cs.Extranonce,
				},
			}
			if err := cs.sendTCPReq(reqExtranonce); err != nil {
				return err
			}
		*/

		paramsDiff := []float64{
			util.DiffIntToFloat(s.config.Proxy.Difficulty),
			//0.5,
			//1.999969,
		}
		respReq := JSONStratumReq{Method: "mining.set_difficulty", Params: paramsDiff}
		if err := cs.sendTCPReq(respReq); err != nil {
			return err
		}

		return cs.sendJob(s, req.Id, true)

	case "mining.extranonce.subscribe":
		var params []string
		if req.Params != nil {
			err := json.Unmarshal(req.Params, &params)
			if err != nil {
				return errors.New("invalid params")
			}
		}
		if len(params) == 0 {
			if err := cs.sendStratumResult(req.Id, true); err != nil {
				return err
			}
			cs.ExtranonceSub = true
			req := JSONStratumReq{
				Id:     0,
				Method: "mining.set_extranonce",
				Params: []interface{}{
					cs.Extranonce,
				},
			}
			return cs.sendTCPReq(req)
		}
		return cs.sendStratumError(req.Id, []string{
			"20",
			"Not supported.",
		})
	case "mining.submit":
		var params []string
		err := json.Unmarshal(req.Params, &params)
		if err != nil || len(params) < 3 {
			log.Println("mining.submit: json.Unmarshal fail")
			return err
		}

		// params[0] = Username
		// params[1] = Job ID
		// params[2] = Minernonce
		// Reference:
		// https://github.com/nicehash/nhethpool/blob/060817a9e646cd9f1092647b870ed625ee138ab4/nhethpool/EthereumInstance.cs#L369

		// WORKER NAME MANDATORY  0x1234.WORKERNAME
		splitData := strings.Split(params[0], ".")
		id := "0"
		if len(splitData) > 1 {
			id = splitData[1]
		}

		// check Extranonce subscription.
		extranonce := cs.Extranonce
		if !cs.ExtranonceSub {
			extranonce = ""
		}
		nonce := extranonce + params[2]

		if cs.JobDetails.JobID != params[1] {
			stale, ok := cs.staleJobs[params[1]]
			if ok {
				log.Printf("Cached stale JobID %s", params[1])
				params = []string{
					nonce,
					stale.SeedHash,
					stale.HeaderHash,
				}
			} else {
				log.Printf("Stale share (mining.submit JobID received %s != current %s)", params[1], cs.JobDetails.JobID)
				if err := cs.sendStratumError(req.Id, []string{"21", "Stale share."}); err != nil {
					return err
				}
				return cs.sendJob(s, req.Id, false)
			}
		} else {
			params = []string{
				nonce,
				cs.JobDetails.SeedHash,
				cs.JobDetails.HeaderHash,
			}
		}

		reply, errReply := s.handleTCPSubmitRPC(cs, id, params)
		if errReply != nil {
			log.Println("mining.submit: handleTCPSubmitRPC failed")
			return cs.sendStratumError(req.Id, []string{
				strconv.Itoa(errReply.Code),
				errReply.Message,
			})
		}

		return cs.sendStratumResult(req.Id, reply)

	default:
		errReply := s.handleUnknownRPC(cs, req.Method)
		if cs.stratum == 1 {
			return cs.sendStratumError(req.Id, []string{
				strconv.Itoa(errReply.Code),
				errReply.Message,
			})
		}
		return cs.sendTCPError(req.Id, errReply)
	}
}

func (cs *Session) sendTCPResult(id int, result interface{}) error {
	cs.Lock()
	defer cs.Unlock()

	message := JSONRpcResp{Id: id, Version: "2.0", Error: nil, Result: result}
	return cs.enc.Encode(&message)
}
func (cs *Session) cacheStales(max, n int) {
	l := len(cs.staleJobIDs)
	// remove outdated stales except last n caches if l > max
	if l > max {
		save := cs.staleJobIDs[l-n : l]
		del := cs.staleJobIDs[0 : l-n]
		for _, v := range del {
			delete(cs.staleJobs, v)
		}
		cs.staleJobIDs = save
	}
	// save stales cache
	cs.staleJobs[cs.JobDetails.JobID] = staleJob{
		cs.JobDetails.SeedHash,
		cs.JobDetails.HeaderHash,
	}
	cs.staleJobIDs = append(cs.staleJobIDs, cs.JobDetails.JobID)
}
func (cs *Session) pushNewJob(result interface{}) error {
	cs.Lock()
	defer cs.Unlock()

	if cs.stratum == 1 {
		cs.cacheStales(10, 3)

		t := result.(*[]string)
		cs.JobDetails = jobDetails{
			JobID:      randomHex(12),
			SeedHash:   (*t)[1],
			HeaderHash: (*t)[0],
			//Height:     (*t)[3],
		}
		// strip 0x prefix
		if cs.JobDetails.SeedHash[0:2] == "0x" {
			cs.JobDetails.SeedHash = cs.JobDetails.SeedHash[2:]
			cs.JobDetails.HeaderHash = cs.JobDetails.HeaderHash[2:]
			//cs.JobDetails.Height = cs.JobDetails.Height[2:]
		}

		resp := JSONStratumReq{
			Method: "mining.notify",
			Params: []interface{}{
				cs.JobDetails.JobID,
				cs.JobDetails.SeedHash,
				cs.JobDetails.HeaderHash,
				// cs.JobDetails.Height,
				// If set to true, then miner needs to clear queue of jobs and immediatelly
				// start working on new provided job, because all old jobs shares will
				// result with stale share error.
				//
				// if true, NiceHash charges "Extra Rewards" for frequent job changes
				// if false, the stale rate might be higher because miners take too long to switch jobs
				//
				// It's undetermined what's more cost-effective
				true,
			},
		}

		//b, _ := json.Marshal(&resp)
		//fmt.Println("------------------------" + string(b))
		return cs.enc.Encode(&resp)
	}

	// FIXME: Temporarily add ID for Claymore compliance
	message := JSONPushMessage{Version: "2.0", Result: result, Id: 0}
	return cs.enc.Encode(&message)
}

func (cs *Session) sendTCPError(id int, reply *ErrorReply) error {
	cs.Lock()
	defer cs.Unlock()

	message := JSONRpcResp{Id: id, Version: "2.0", Error: reply}
	err := cs.enc.Encode(&message)
	if err != nil {
		return err
	}
	return errors.New(reply.Message)
}

func (cs *Session) sendStratumResult(id int, result interface{}) error {
	cs.Lock()
	defer cs.Unlock()

	resp := JSONRpcResp{Id: id, Error: nil, Result: result}
	resp.Version = "2.0"
	return cs.enc.Encode(&resp)
}

func (cs *Session) sendStratumError(id int, message interface{}) error {
	cs.Lock()
	defer cs.Unlock()

	resp := JSONRpcResp{Id: id, Error: message}
	resp.Version = "2.0"
	return cs.enc.Encode(&resp)
}

func (cs *Session) sendTCPReq(resp JSONStratumReq) error {
	cs.Lock()
	defer cs.Unlock()

	return cs.enc.Encode(&resp)
}

func (self *ProxyServer) setDeadline(conn *net.TCPConn) {
	conn.SetDeadline(time.Now().Add(self.timeout))
}

func (s *ProxyServer) registerSession(cs *Session) {
	s.sessionsMu.Lock()
	defer s.sessionsMu.Unlock()
	s.sessions[cs] = struct{}{}
}

func (s *ProxyServer) removeSession(cs *Session) {
	s.sessionsMu.Lock()
	defer s.sessionsMu.Unlock()
	delete(s.sessions, cs)
}

// nicehash
func (cs *Session) sendJob(s *ProxyServer, id int, newjob bool) error {
	if newjob {
		reply, errReply := s.handleGetWorkRPC(cs)
		if errReply != nil {
			return cs.sendStratumError(id, []string{
				string(errReply.Code),
				errReply.Message,
			})
		}
		//fmt.Printf("----sendjob, values \n\t1:%v\n\t2:%v\n\t3:%v", reply[0], reply[1], reply[2])
		//height, err := r.GetBlockByHeight(nil)
		//block, err := rpc.GetBlockByHeight(0)
		//fmt.Printf("---height is %v\n", block)
		cs.JobDetails = jobDetails{
			JobID:      randomHex(12),
			SeedHash:   reply[1],
			HeaderHash: reply[0],
			//Height:     reply[3],
		}

		// The NiceHash official .NET pool omits 0x...
		// TO DO: clean up once everything works
		if cs.JobDetails.SeedHash[0:2] == "0x" {
			cs.JobDetails.SeedHash = cs.JobDetails.SeedHash[2:]
			cs.JobDetails.HeaderHash = cs.JobDetails.HeaderHash[2:]
			//cs.JobDetails.Height = cs.JobDetails.Height[2:]
		}
	}

	resp := JSONStratumReq{
		Method: "mining.notify",
		Params: []interface{}{
			cs.JobDetails.JobID,
			cs.JobDetails.SeedHash,
			//"6c010ac38dd579817cdce09040d86d739b09fb67f538ed42a0c5d246ea3914a1",
			cs.JobDetails.HeaderHash,
			//cs.JobDetails.Height,
			true,
		},
	}
	//b, _ := json.Marshal(&resp)
	//fmt.Println("------------------------" + string(b))
	return cs.sendTCPReq(resp)
}

func (s *ProxyServer) broadcastNewJobs() {
	t := s.currentBlockTemplate()
	if t == nil || len(t.Header) == 0 || s.isSick() {
		return
	}
	//reply := []string{t.Header, t.Seed, s.diff}
	reply := []string{t.Header, t.Seed, s.diff, util.ToHex(int64(t.Height))}

	s.sessionsMu.RLock()
	defer s.sessionsMu.RUnlock()

	count := len(s.sessions)
	log.Printf("Broadcasting new job to %v stratum miners", count)

	start := time.Now()
	bcast := make(chan int, 1024)
	n := 0

	for m, _ := range s.sessions {
		n++
		bcast <- n

		go func(cs *Session) {
			err := cs.pushNewJob(&reply)
			<-bcast
			if err != nil {
				log.Printf("Job transmit error to %v@%v: %v", cs.login, cs.ip, err)
				s.removeSession(cs)
			} else {
				s.setDeadline(cs.conn)
			}
		}(m)
	}
	log.Printf("Jobs broadcast finished %s", time.Since(start))
}

func (s *ProxyServer) uniqExtranonce() string {
	s.sessionsMu.RLock()
	defer s.sessionsMu.RUnlock()

	extranonce := randomHex(6)
	for {
		if _, ok := s.Extranonces[extranonce]; ok {
			extranonce = randomHex(6)
		} else {
			break
		}
	}
	s.Extranonces[extranonce] = true
	return extranonce
}

func randomHex(strlen int) string {
	const chars = "0123456789abcdef"
	result := make([]byte, strlen)
	for i := 0; i < strlen; i++ {
		result[i] = chars[rand.Intn(len(chars))]
	}
	return string(result)
}

func (cs *Session) getNotificationResponse(s *ProxyServer) interface{} {
	result := make([]interface{}, 2)
	cs.subscriptionID = randomHex(16)
	//cs.subscriptionID = randomHex(4)
	result[0] = []string{"mining.notify", cs.subscriptionID, "EthereumStratum/1.0.0"}
	//result[0] = []string{"mining.notify", "0000", "EthereumStratum/1.0.0"}
	result[1] = cs.Extranonce

	return result
}
