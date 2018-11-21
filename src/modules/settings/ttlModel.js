import { toBig } from 'LoopringJS/common/formatter'
const MODULES = 'ttl'

export default {
  namespace: MODULES,
  state: {
    validSince: null,
    validUntil: null,
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
        validSince: null,
        validUntil: null,
      }
    },
    validTimeChange (state, action) {
      let {payload} = action
      const {validSince, validUntil} = payload
      const since = validSince ? validSince : state.validSince
      const until = validUntil ? validUntil : state.validUntil
      return {
        ...state,
        validSince : since,
        validUntil : until
      }
    },
  },
}

