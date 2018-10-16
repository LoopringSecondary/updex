
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
        switch(task) {
          case 'placeOrder':
            // yield window.WALLET.signOrderHelper(data)
            const unsign = [{type:'order', data}]
            window.STORE.dispatch({type:'placeOrderSteps/unsign', payload: {unsign, signWith:window.WALLET.getUnlockType()}})
            window.STORE.dispatch({type: 'layers/showLayer', payload: {id: 'helperOfSignStepPC'}})
            break;
          case 'approve':

            break;
        }
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


