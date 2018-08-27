import { UPDATE_ACCOUNT } from './actions'

const initialState = {
  current: null,
}

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ACCOUNT:
      if (state.current && state.current.toLowerCase() === action.account.toLowerCase()) {
        return state
      }
      return Object.assign({}, state, {
        current: action.account,
      })
    default:
      return state
  }
}

export { accountReducer }
export default accountReducer
