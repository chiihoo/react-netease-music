import { combineReducers } from 'redux'
import { FindReducer } from '../containers/Find/store'

const reducers = combineReducers({ Find: FindReducer })

export default reducers
