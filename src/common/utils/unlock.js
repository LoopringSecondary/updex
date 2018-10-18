import intl from "react-intl-universal";
import Notification from 'LoopringUI/components/Notification'
import {MetaMaskAccount} from "common/wallets/account";

export const unlockWithMetaMask = (dispatch) => {
  if (!window.web3 || !window.web3.eth.accounts[0]) {
    let content = intl.get('wallet_meta.install_tip')
    if(window.web3 && !window.web3.eth.accounts[0]) { // locked
      content = intl.get('wallet_meta.unlock_tip')
    }
    Notification.open({
      message:intl.get('notifications.title.unlock_fail'),
      description:content,
      type:'error'
    })
    dispatch({type: 'metaMask/setLoading', payload: {loading:false}});
    return
  }
  window.web3.version.getNetwork((err, netId) => {
    if (netId !== '1') {
      Notification.open({
        message:intl.get('notifications.title.unlock_fail'),
        description:intl.get('wallet_meta.mainnet_tip'),
        type:'error'
      })
      dispatch({type: 'metaMask/setLoading', payload: {loading:false}});
      return
    }
    let address = window.web3.eth.accounts[0]
    dispatch({type:'wallet/unlockMetaMaskWallet',payload:{address}});
    dispatch({type: 'sockets/unlocked'});
    dispatch({type: 'metaMask/setLoading', payload: {loading:false}});
    dispatch({type:"layers/hideLayer", payload:{id:'authOfPC'}})
    Notification.open({type:'success',message:intl.get('notifications.title.unlock_suc')});
    window.WALLET = new MetaMaskAccount(window.web3);
    window.RELAY.account.register(address)
    let alert = false
    var accountInterval = setInterval(function() {
      if ((!window.web3 || !window.web3.eth.accounts[0]) && !alert) {
        alert = true
        console.log("MetaMask account locked:", address)
        clearInterval(accountInterval)
        dispatch({type:'wallet/lock'});
        Notification.open({
          message:intl.get('wallet_meta.logout_title'),
          description:intl.get('wallet_meta.logout_tip'),
          type:'warning'
        })
        return
      }
      if (window.web3.eth.accounts[0] && window.web3.eth.accounts[0] !== address) {
        address = window.web3.eth.accounts[0];
        Notification.open({
          message:intl.get('wallet_meta.account_change_title'),
          description:intl.get('wallet_meta.account_change_tip'),
          type:'info'
        })
        console.log("MetaMask account changed to:", address)
        dispatch({type:'wallet/unlockMetaMaskWallet',payload:{address}});
        dispatch({type: 'sockets/unlocked'});
      }
    }, 100);
  })
}
