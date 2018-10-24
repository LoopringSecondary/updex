import config from 'common/config'
import { toBig } from 'LoopringJS/common/formatter'
import {Toast} from 'antd-mobile'
const MODULES = 'p2pOrder'
export default {
  namespace: MODULES,
  state: {
    tokenS: 'LRC',
    tokenB: 'WETH',
    amountS: toBig(0),
    amountB: toBig(0),
    validSince: null,
    validUntil: null,
    loading: false,
    qrcode: '',
    fetchOrder:false
  },
  subscriptions:{
    setup({ dispatch, history }) {
      window.handleP2POrder = ({result}) => {
        const {hash, auth, count} = JSON.parse(result).value
        window.RELAY.order.getOrderByHash({orderHash: hash}).then(res => {
          if (res.error) {
            Toast.fail(res.error.message)
          } else {
            const order = res.result
            order.originalOrder.authPrivateKey = auth;
            if (order.status === 'ORDER_OPENED' || order.status === 'ORDER_WAIT_SUBMIT_RING') {
              dispatch({
                type: 'layers/showLayer',
                payload: {
                  id:'takerConfirm',
                  makerOrder:{
                    auth:auth, count,
                    originalOrder:order.originalOrder
                  }
                }
              })
            }else{
              Toast.fail('This Order is completed, canceled or expired')
            }
          }
        })
      };
    }
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
        amountS: toBig(0),
        amountB: toBig(0),
        validSince: null,
        validUntil: null,
        loading: false,
        qrcode: '',
        fetchOrder:false
      }
    },
    tokenChange (state, action) {
      let {payload} = action
      const {tokenS, tokenB} = payload
      return {
        ...state,
        tokenS: tokenS || state.tokenS,
        tokenB: tokenB || state.tokenB
      }
    },
    amountChange (state, action) {
      let {payload} = action
      const {amountS, amountB} = payload
      return {
        ...state,
        amountS: amountS || state.amountS,
        amountB: amountB || state.amountB,
      }
    },
    loadingChange (state, action) {
      let {payload} = action
      const {loading} = payload
      return {
        ...state,
        loading
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
    validTimeChange (state, action) {
      let {payload} = action
      const {validSince, validUntil} = payload
      return {
        ...state,
        validSince,
        validUntil
      }
    },
    setFetchOrder(state,{payload}){
      const {fetchOrder} = payload
      return {
        ...state,
        fetchOrder
      }
    },
    swap(state){
      console.log('Swap')
      const {amountS,amountB,tokenS,tokenB}= state
      return {
        ...state,
        amountS:amountB,
        amountB:amountS,
        tokenS:tokenB,
        tokenB:tokenS
      }
    }
  },
}


