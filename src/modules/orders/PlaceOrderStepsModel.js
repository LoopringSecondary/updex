const MODULES = 'placeOrderSteps'
export default {
  namespace: MODULES,
  state: {
    step:0, //0:qrcode/toconnect, 1:signing 2:result
    task: '', //sign, approve, approveZero, cancelOrder, convert, cancelTx, resendTx, transfer
    signWith: '', //address, loopr, upWallet, meteMask, ledger
    originOrder:{},
    unsign:null, //{type:sign, data:{}},{type:approve, data:{}}
    signed:null,
    signResult:0, //0:signing 1:success 2:failed
    error:'', //sign error message
    hash:'',
    qrcode:'', //original data. {type:'sign', 'id':hash}
    generateTime:null,
    overdue:false
  },
  effects:{
    *init({ payload={} }, { put }) {

    },
    *reset({ payload={} }, { put }) {
      yield put({ type: 'stepChange',payload:{step:0}});
      yield put({ type: 'taskChange',payload:{task:''}});
      yield put({ type: 'unsignChange',payload:{unsign:null}})
      yield put({ type: 'signedChange',payload:{signed:null}})
      yield put({ type: 'hashChange',payload:{hash:''}});
      yield put({ type: 'qrcodeChange',payload:{qrcode:''}});
      yield put({ type: 'generateTimeChange',payload:{generateTime:null}});
      yield put({ type: 'overdueChange',payload:{overdue:false}});
      yield put({ type: 'signResultChange',payload:{signResult:0}})
      yield put({ type: 'errorChange',payload:{error:''}});
    },
    *qrcodeGenerated({ payload={} }, { put }) {
      const {signWith, order, qrcode, hash, time} = payload
      yield put({ type: 'unsignChange',payload:{unsign:[{type:'order', data:order}]}})
      yield put({ type: 'signedChange',payload:{signed:[]}})
      yield put({ type: 'signWithChange',payload:{signWith}})
      yield put({ type: 'hashChange',payload:{hash}});
      yield put({ type: 'qrcodeChange',payload:{qrcode}});
      yield put({ type: 'generateTimeChange',payload:{generateTime:time}});
    },
    * unsign({ payload={} }, { put }) {
      const {task, unsign, signWith} = payload
      yield put({ type: 'stepChange',payload:{step:1}});
      yield put({ type: 'taskChange',payload:{task}});
      yield put({ type: 'signWithChange',payload:{signWith}})
      yield put({ type: 'unsignChange',payload:{unsign}})
      yield put({ type: 'signedChange',payload:{signed:[]}})
      yield put({ type: 'hashChange',payload:{hash:''}});
      yield put({ type: 'qrcodeChange',payload:{qrcode:''}});
      yield put({ type: 'generateTimeChange',payload:{generateTime:null}});
      yield put({ type: 'overdueChange',payload:{overdue:false}});
      yield put({ type: 'signResultChange',payload:{signResult:0}})
      yield put({ type: 'errorChange',payload:{error:''}});
    },
    * signed({ payload={} }, { put }) {
      const {signResult, error} = payload
      yield put({ type: 'stepChange',payload:{step:2}});
      yield put({ type: 'signResultChange',payload:{signResult}})
      yield put({ type: 'errorChange',payload:{error}});
    },
    // *scanned({ payload={} }, { put, select }) {
    //   const {hash} = payload
    //   const state = yield select(({ [MODULES]:state }) => state )
    //   if(state.hash === hash) {
    //     yield put({ type: 'stepChange',payload:{step:1}});
    //   }
    // },
    // *submitFailed({ payload={} }, { put, select }) {
    //   const {hash} = payload
    //   const state = yield select(({ [MODULES]:state }) => state )
    //   if(state.hash === hash) {
    //     yield put({ type: 'orderStateChange',payload:{orderState:2}});
    //     yield put({ type: 'stepChange',payload:{step:2}});
    //   }
    // },
    // *submitSuccessfully({ payload={} }, { put, select }) {
    //   const {hash} = payload
    //   const state = yield select(({ [MODULES]:state }) => state )
    //   if(state.hash === hash) {
    //     //yield put({ type: 'orderStateChange',payload:{orderState:1}});
    //     yield put({ type: 'stepChange',payload:{step:2}});
    //   }
    // },
  },
  reducers: {
    hashChange(state, action) {
      const {payload} = action
      let {hash} = payload
      return {
        ...state,
        hash
      }
    },
    stepChange(state, action) {
      const {payload} = action
      let {step} = payload
      return {
        ...state,
        step
      }
    },
    taskChange(state, action) {
      const {payload} = action
      let {task} = payload
      return {
        ...state,
        task
      }
    },
    unsignChange(state, action) {
      const {payload} = action
      let {unsign} = payload
      return {
        ...state,
        unsign
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
    signWithChange(state, action) {
      const {payload} = action
      let {signWith} = payload
      return {
        ...state,
        signWith
      }
    },
    errorChange(state, action) {
      const {payload} = action
      let {error} = payload
      return {
        ...state,
        error
      }
    },
    signResultChange(state, action) {
      const {payload} = action
      let {signResult} = payload
      return {
        ...state,
        signResult
      }
    },
    qrcodeChange(state, action) {
      const {payload} = action
      let {qrcode} = payload
      return {
        ...state,
        qrcode
      }
    },
    generateTimeChange(state, action) {
      const {payload} = action
      let {generateTime} = payload
      return {
        ...state,
        generateTime
      }
    },
    overdueChange(state, action) {
      const {payload} = action
      let {overdue} = payload
      return {
        ...state,
        overdue
      }
    },
  },
};


