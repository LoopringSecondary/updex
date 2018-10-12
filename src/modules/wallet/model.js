import {register} from "LoopringJS/relay/rpc/account";
import {
  AddressAccount,
  LooprAccount,
  UpWalletAccount,
  MetaMaskAccount,
  LedgerAccount
} from "common/wallets/account";
import {mnemonictoPrivatekey} from "LoopringJS/ethereum/mnemonic";
import {formatKey} from "LoopringJS/common/formatter";
import storage from '../storage/'
import intl from 'react-intl-universal';
import Notification from 'LoopringUI/components/Notification'

const unlockWithAddress = (address) => {
  if(address) {
    window.WALLET = new AddressAccount(address);
  }
}

const unlockWithLoopr = (address) => {
  window.WALLET = new LooprAccount(address);
}

const unlockWithUpWallet = (address) => {
  window.WALLET = new UpWalletAccount(address);
}

const unlockWithMetaMask = () => {
  if (window.web3 && window.web3.eth.accounts[0]) {
    window.web3.version.getNetwork((err, netId) => {
      if (netId !== '1') {
        Notification.open({
          message:intl.get('notifications.title.unlock_fail'),
          description:intl.get('wallet_meta.mainnet_tip'),
          type:'error'
        })
        return
      }
      window.WALLET = new MetaMaskAccount(window.web3);
      Notification.open({type:'success',message:intl.get('notifications.title.unlock_suc')});
    })
  } else {
    let content = intl.get('wallet_meta.install_tip')
    if(window.web3 && !window.web3.eth.accounts[0]) { // locked
      content = intl.get('wallet_meta.unlock_tip')
    }
    Notification.open({
      message:intl.get('notifications.title.unlock_fail'),
      description:content,
      type:'error'
    })
  }
}

let unlockedType = storage.wallet.getUnlockedType()
let unlockedAddress = storage.wallet.getUnlockedAddress()
switch(unlockedType) {
  case 'address':
    unlockWithAddress(unlockedAddress)
    break;
  case 'loopr':
    unlockWithLoopr(unlockedAddress)
    break;
  case 'upWallet':
    unlockWithUpWallet(unlockedAddress)
    break;
  case 'ledger':
    if(unlockedAddress) {
      unlockedType = 'address'
      unlockWithAddress(unlockedAddress)
      Notification.open({
        type:'info',
        message:intl.get('notifications.title.in_watch_only_mode'),
        description:intl.get('notifications.message.unlock_by_cookie_address')
      });
    } else {
      unlockedType = ''
    }
    break;
  case 'metaMask':
    if(unlockedAddress) {
      let last = 0
      var accountInterval = setInterval(function() {
        if(window.web3 && window.web3.eth.accounts[0] && window.web3.eth.accounts[0] === unlockedAddress) {
          clearInterval(accountInterval)
          unlockWithMetaMask()
          return
        }
        last += 100
        if(last > 2000) {
          clearInterval(accountInterval)
          unlockedType = 'address'
          unlockWithAddress(unlockedAddress)
          Notification.open({
            type:'info',
            message:intl.get('notifications.title.in_watch_only_mode'),
            description:intl.get('notifications.message.unlock_by_cookie_address')
          });
          return
        }
      }, 100);
    } else {
      unlockedType = ''
    }
    break;
}


export default {
  namespace: 'wallet',
  state: {
    address: unlockedAddress || "",
    unlockType: unlockedType || "locked",
    password: "",
    account: null
  },
  reducers: {
    unlock(state, {payload}) {
      const {address, unlockType, account, password} = payload;
      return {
        ...state,
        address,
        unlockType,
        account,
        password: password || state.password
      }
    },
    lock(state, {payload}) {
      window.WALLET = null;
      return {
        ...state,
        address: "",
        unlockType: "locked",
        account: null
      }
    }
  },
  effects: {
    * unlockWallet({payload}, {put, call}) {
      const {address, unlockType} = payload;
      storage.wallet.storeUnlockedAddress(unlockType, address);
      // yield call(register, {owner:payload.address});
      yield put({type: 'unlock', payload});
      yield put({type: 'placeOrder/unlock'});
    },
    * unlockAddressWallet({payload}, {put}) {
      const unlockType = 'address';
      yield put({type: 'unlockWallet', payload: {...payload, unlockType}})
    },
    * unlockLooprWallet({payload}, {put}) {
      const unlockType = 'loopr';
      const {address} = payload
      unlockWithLoopr(address)
      yield put({type: 'unlockWallet', payload: {...payload, unlockType}})
    },
    * unlockUpWallet({payload}, {put}) {
      const unlockType = 'upWallet';
      const {address} = payload
      unlockWithUpWallet(address)
      yield put({type: 'unlockWallet', payload: {...payload, unlockType}})
    },
    * unlockMetaMaskWallet({payload}, {put}) {
      const {address} = payload;
      const unlockType = 'metaMask';
      unlockWithMetaMask()
      yield put({type: 'unlockWallet', payload: {address, unlockType}});
    },
    * unlockLedgerWallet({payload}, {put}) {
      const {ledger, dpath} = payload;
      const account = new LedgerAccount(ledger, dpath);
      const address = yield account.getAddress();
      const unlockType = 'ledger';
      yield put({type: 'unlockWallet', payload: {address, unlockType, account}});
    },
  }
}
