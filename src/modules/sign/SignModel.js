import config from 'common/config'
import { toBig } from 'LoopringJS/common/formatter'
const MODULES = 'sign'
export default {
  namespace: MODULES,
  state: {
    qrcode: {},
    unsigned:[], //{type:order, data:{}},{type:approve, data:{}}  type:[order, approve, approveZero, cancelOrder, convert, cancelTx, resendTx, transfer]
    signed:[],
  },
  effects: {
    * init ({payload = {}}, {put}) {
      //yield put({ type: 'tokenChange',payload});
    },
    * unsigned({ payload={} }, { put }) {
      const {unsigned} = payload
      yield put({ type: 'unsignedChange',payload:{unsigned}})
      yield put({ type: 'signedChange',payload:{signed:[]}})
      yield put({ type: 'qrcodeChange',payload:{qrcode:''}});
    },
  },
  reducers: {
    reset (state, action) {
      return {
        ...state,
        qrcode: {},
        unsigned:[],
        signed:[],
      }
    },
    qrcodeChange (state, action) {
      let {payload} = action
      const {qrcode} = payload
      return {
        ...state,
        qrcode
      }
    },
    unsignedChange(state, action) {
      const {payload} = action
      let {unsigned} = payload
      return {
        ...state,
        unsigned
      }
    },
    signedChange(state, action) {
      const {payload} = action
      let {signed} = payload
      return {
        ...state,
        signed
      }
    },
  },
}


