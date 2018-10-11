import {register} from "LoopringJS/relay/rpc/account";
import {LedgerAccount, MetaMaskAccount,} from "LoopringJS/ethereum/account";
import storage from '../storage/'

let unlockedType = storage.wallet.getUnlockedType()
let unlockedAddress = storage.wallet.getUnlockedAddress()
if (unlockedAddress) {
  unlockedType = 'address'
} else {
  unlockedType = ''
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
      window.WALLET = {address, unlockType};
      //yield call(register, {owner:payload.address});
      yield put({type: 'unlock', payload});
      yield put({type: 'placeOrder/unlock'});
    },
    * unlockAddressWallet({payload}, {put}) {
      const unlockType = 'address';
      yield put({type: 'unlockWallet', payload: {...payload, unlockType}})
    },
    * unlockMetaMaskWallet({payload}, {put}) {
      const {address} = payload;
      const unlockType = 'metaMask';
      window.account = new MetaMaskAccount(window.web3);
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
