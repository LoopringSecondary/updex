
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
      switch(task) {
        case 'placeOrder':
          yield window.WALLET.signOrder(data)
          break;
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


