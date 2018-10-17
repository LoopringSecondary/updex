
const MODULES = 'task'
export default {
  namespace: MODULES,
  state: {
    task:'', //placeOrder, cancelOrder
    data:{}
  },
  effects:{
    *init({ payload={} }, { put }) {
      yield put({ type: 'pairChangeEffects',payload});
    },
    *setTask({ payload={} }, { call, put }) {
      yield put({ type: 'taskChange', payload});
      const {task, data} = payload
      if(window.WALLET && window.WALLET.getUnlockType() !== 'address') {
        const unsign = [{type:task, data}]
        window.STORE.dispatch({type:'placeOrderSteps/unsign', payload: {task, unsign, signWith:window.WALLET.getUnlockType()}})
        window.STORE.dispatch({type: 'layers/showLayer', payload: {id: 'helperOfSignStepPC'}})
        // switch(task) {
        //   case 'order':
        //     // yield window.WALLET.signOrderHelper(data)
        //     window.STORE.dispatch({type:'placeOrderSteps/unsign', payload: {task, unsign, signWith:window.WALLET.getUnlockType()}})
        //     window.STORE.dispatch({type: 'layers/showLayer', payload: {id: 'helperOfSignStepPC'}})
        //     break;
        //   case 'approve':
        //
        //     break;
        //   case 'cancelOrder':
        //
        //     break;
        //   case 'convert':
        //
        //     break;
        //   case 'cancelTx':
        //
        //     break;
        //   case 'resendTx':
        //
        //     break;
        //   case 'transfer':
        //
        //     break;
        // }
      } else {
        window.STORE.dispatch({type:'placeOrderSteps/stepChange', payload: {step:1}})
        //window.STORE.dispatch({type: 'layers/hideLayer', payload: {id: 'placeOrderSteps'}})
        window.STORE.dispatch({type: 'layers/showLayer', payload: {id: 'auth2'}})
      }
    },
  },
  reducers: {
    taskChange(state, action) {
      let {payload} = action
      let {task, data} = payload
      return {
        ...state,
        task, data
      }
    },
  },
};


