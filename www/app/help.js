import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    async addVBCToMetaMask() {
      if (!window.ethereum) {
        alert('MetaMask is not installed. Please install it to use this feature.');
        return;
      }

      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x149',
            chainName: 'VirBiCoin',
            nativeCurrency: {
              name: 'VirBiCoin',
              symbol: 'VBC',
              decimals: 18,
            },
            rpcUrls: ['https://rpc.digitalregion.jp'],
            blockExplorerUrls: ['https://explorer.digitalregion.jp']
          }],
        });
      } catch (addError) {
        console.error('Failed to add VirBiCoin network:', addError);
        alert('Failed to add VirBiCoin network. See console for details.');
      }
    }
  }
});
