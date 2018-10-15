import { keccakHash } from 'LoopringJS/common/utils'

const placeOrder = (order) => {
  const hash = keccakHash(JSON.stringify([{type:"order",data:order}]))

}

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
          const res = yield window.WALLET.signOrder(data)
          console.log(11111, res)
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


