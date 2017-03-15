import { SIGNUP_REQUEST, SIGNUP_SUCCESS, SIGNUP_FAILURE } from '../actions/auth'

export default function signUp(state = {
	isFetching: false,
	isSignUp: false
}, action) {
	switch(action.type) {
		case SIGNUP_REQUEST:
			return Object.assign({}, state, {
				isFetching: action.isFetching,
				isSignUp: action.isSignUp,
				userInfo: action.creds
			})
		case SIGNUP_SUCCESS:
			return Object.assign({}, state, {
				isFetching: action.isFetching,
				isSignUp: action.isSignUp,
				userInfo: action.userInfo
			})
		case SIGNUP_FAILURE: 
			return Object.assign({}, state, {
				isFetching: action.isFetching,
				isSignUp: action.isSignUp,
				message: action.message
			})
		default:
			return state
	}
}
