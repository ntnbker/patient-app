import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import auth from './auth'
import signUp from './signUp'
import data from './patient'
const rootReducer = combineReducers({
	form,
	routing,
	auth,
	signUp,
	data
})

export default rootReducer