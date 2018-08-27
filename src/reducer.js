import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { drizzleReducers } from 'drizzle'
import { accountReducer } from './accounts/reducer'

const reducer = combineReducers({
  routing: routerReducer,
  account: accountReducer,
  ...drizzleReducers
})

export default reducer
