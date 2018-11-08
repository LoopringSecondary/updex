import config from 'common/config'
import { toBig } from 'LoopringJS/common/formatter'
import {Toast} from 'antd-mobile'
const MODULES = 'sign'
export default {
  namespace: MODULES,
  state: {
    qrcode: {},
    unsigned:null,
    signed:null,
  },
  effects: {
    * init ({payload = {}}, {put}) {
      //yield put({ type: 'tokenChange',payload});
    },
  },
  reducers: {
    reset (state, action) {
      return {
        ...state,
        qrcode: {},
        unsigned:null,
        signed:null,
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


