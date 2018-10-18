
const MODULES = 'task'
export default {
  namespace: MODULES,
  state: {
    task:'',
    data:{}
  },
  effects:{
    *init({ payload={} }, { put }) {
      yield put({ type: 'taskChange',payload:{task:'', data:{}}});
    },
    *setTask({ payload={} }, { call, put }) {
      yield put({ type: 'taskChange', payload});
      const {task, unsign} = payload
      if(window.WALLET && window.WALLET.getUnlockType() !== 'address') {
        window.STORE.dispatch({type:'placeOrderSteps/unsign', payload: {task, unsign, signWith:window.WALLET.getUnlockType()}})
        window.STORE.dispatch({type: 'layers/showLayer', payload: {id: 'helperOfSignStepPC'}})
      } else {
        window.STORE.dispatch({type:'placeOrderSteps/stepChange', payload: {step:1}})
        //window.STORE.dispatch({type: 'layers/hideLayer', payload: {id: 'placeOrderSteps'}})
        window.STORE.dispatch({type: 'layers/showLayer', payload: {id: 'authOfPC'}})
      }
    },
  },
  reducers: {
    taskChange(state, action) {
      let {payload} = action
      let {task, data} = payload
      return {
        ...state,
        task,
        data
      }
    },
  },
};


