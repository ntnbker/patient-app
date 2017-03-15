import { push } from 'react-router-redux'
import { requesterAuth, requesterSignUp, requesterUserinfo, requesterLogout } from '../api/auth'
export const LOGIN_REQUEST = 'SLS/PRACTICE/LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'SLS/PRACTICE/LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'SLS/PRACTICE/LOGIN_FAILURE'

//creds: user info
function loginRequest(authType, creds) {
	return {
		type: LOGIN_REQUEST,
		isFetching: true,
		isAuthenticated: false,
		authType,
		creds
	}
}

function loginSuccess(user) {
	return {
		type: LOGIN_SUCCESS,
		isFetching: false,
		isAuthenticated: true,
		userInfo: user
	}
}

function loginFailure(message) {
	return {
		type: LOGIN_FAILURE,
		isFetching: false,
		isAuthenticated: false,
		message
	}
}

export function auth(authType, creds) {
	return (dispatch, getState) => {
		dispatch(loginRequest(authType, creds))
		return requesterAuth(authType, creds, (err, data) => {
			if(err)
				dispatch(loginFailure(err))
			else {
				dispatch(loginSuccess(data))
				dispatch(push('/dashboard'))
			}
		})
	}
}

export const SIGNUP_REQUEST = 'SLS/PRACTICE/SIGNUP_REQUEST'
export const SIGNUP_SUCCESS = 'SLS/PRACTICE/SIGNUP_SUCCESS'
export const SIGNUP_FAILURE = 'SLS/PRACTICE/SIGNUP_FAILURE'

function signUpRequest(creds) {
	return {
		type: SIGNUP_REQUEST,
		isFetching: true,
		isSignUp: false,
		creds
	}
}

function signUpSuccess(userInfo) {
	return {
		type: SIGNUP_SUCCESS,
		isFetching: false,
		isSignUp: true,
		userInfo
	}
}

function signUpFailure(message) {
	return {
		type: SIGNUP_FAILURE,
		isFetching: false,
		isSignUp: false,
		message
	}
}
export function signUp(creds) {
	return (dispatch, getState) => {
		dispatch(signUpRequest(creds))
		return requesterSignUp(creds, (err, data) => {
			if(err)
				dispatch(signUpFailure(err))
			else {
				dispatch(signUpSuccess(data))
				dispatch(auth('local',{
					username: data.username,
					password: data.password
				}))
			}
		})
	}
}

export const GET_USERINFO_REQUEST = 'SLS/PRACTICE/GET_USERINFO_REQUEST'
export const GET_USERINFO_SUCCESS = 'SLS/PRACTICE/GET_USERINFO_SUCCESS'
export const GET_USERINFO_FAILURE = 'SLS/PRACTICE/GET_USERINFO_FAILURE'

function getUserinfoRequest(creds) {
	return {
		type: GET_USERINFO_REQUEST,
		isFetching: true
	}
}

function getUserinfoSuccess(userInfo) {
	return {
		type: GET_USERINFO_SUCCESS,
		isFetching: false,
		isAuthenticated: true,
		userInfo
	}
}

function getUserinfoFailure(message) {
	return {
		type: GET_USERINFO_FAILURE,
		isFetching: false,
		isAuthenticated: false,
		message
	}
}
export function getUserInfo(creds) {
	return (dispatch, getState) => {
		dispatch(getUserinfoRequest(creds))
		return requesterUserinfo((err, data) => {
			if(err) {
				dispatch(getUserinfoFailure(err))
				dispatch(push('/login'))
			}
			else {
				dispatch(getUserinfoSuccess(data))
				console.log('USER DATA', data)
				dispatch(push('/detail/' + data._id))
			}
		})
	}
}


export const LOGOUT_REQUEST = 'SLS/PRACTICE/LOGOUT_REQUEST'
export const LOGOUT_SUCCESS = 'SLS/PRACTICE/LOGOUT_SUCCESS'
export const LOGOUT_FAILURE = 'SLS/PRACTICE/LOGOUT_FAILURE'

function logoutRequest() {
	return {
		type: LOGOUT_REQUEST,
		isFetching: false,
		isAuthenticated: true
	}
}

function logoutSuccess() {
	return {
		type: LOGOUT_SUCCESS
	}
}

function logoutFailure(message) {
	return {
		type: LOGOUT_FAILURE,
		isFetching: false,
		isAuthenticated: false,
		message
	}
}
export function logout() {
	return (dispatch) => {
		dispatch(logoutRequest())
		return requesterLogout((err) => {
			if(err) {
				dispatch(logoutFailure(err))
			}
			else {
				dispatch(push('/'))
			}
		})
	}
}


