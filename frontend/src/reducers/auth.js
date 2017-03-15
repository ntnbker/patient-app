import { 
	LOGIN_REQUEST, 
	LOGIN_SUCCESS, 
	LOGIN_FAILURE,
	GET_USERINFO_REQUEST,
	GET_USERINFO_SUCCESS,
	GET_USERINFO_FAILURE
} from '../actions/auth'

export default function auth(state = {
	isFetching: false,
	isAuthenticated: false,
	userInfo: {
		finishedCount: 0
	}
}, action) {
	switch(action.type) {
		case LOGIN_REQUEST:
			return Object.assign({}, state, {
				isFetching: action.isFetching,
				isAuthenticated: action.isAuthenticated,
				authType: action.authType,
				userInfo: action.creds
			})
		case LOGIN_SUCCESS:
			return Object.assign({}, state, {
				isFetching: action.isFetching,
				isAuthenticated: action.isAuthenticated,
				userInfo: action.userInfo
			})
		case LOGIN_FAILURE: 
			return Object.assign({}, state, {
				isFetching: action.isFetching,
				isAuthenticated: action.isAuthenticated,
				message: action.message
			})
		case GET_USERINFO_REQUEST:
			return Object.assign({}, state, {
				isFetching: action.isFetching
			})
		case GET_USERINFO_SUCCESS:
			return Object.assign({}, state, {
				isFetching: action.isFetching,
				isAuthenticated: action.isAuthenticated,
				userInfo: action.userInfo
			})
		case GET_USERINFO_FAILURE: 
			return Object.assign({}, state, {
				isFetching: action.isFetching,
				isAuthenticated: action.isAuthenticated,
				message: action.message
			})
		default:
			return state
	}
}
