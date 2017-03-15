import 'whatwg-fetch'
import cookie from 'react-cookie'
const domain = process.env.NODE_ENV === 'production' && 'https://pta-api.herokuapp.com/' || 'http://localhost:9000/'
const pathLoginLocal = domain + 'auth/local'
const pathLoginFacebook = domain + '/auth/facebook'
const pathSignUp = domain + 'signup'
const pathGetUserinfo = domain + 'v1/userinfo'
const pathLogout = domain + 'auth/local'

export function requesterAuth(authType, creds, callback) {
	// console.log('api auth')
	let path = authType === 'local' ? pathLoginLocal : pathLoginFacebook
	let config = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json'},
		body: JSON.stringify(creds),
		credentials: 'include'
	}
	fetch(path, config)
		.then(response =>
      	response.json().then(user => ({ user, response }))
	    ).then(({ user, response }) => {
	    	// console.log('user', user)
	    	// console.log('response', response)
	      if (!response.ok) {
	      	window.alert("LOGIN FAIL")
	      	return callback(user.error)
	      }
	      if(response.status === 400) {
	      	window.alert("LOGIN FAIL")
	      	return callback(user.error)
	      }
	      else {
	      	return callback(null, user)
	      }
	    })	
}

export function requesterSignUp(creds, callback) {
	let config = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json'},
		body: JSON.stringify(creds),
		credentials: 'include'
	}
	fetch(pathSignUp, config)
		.then(response => {
			if(!response.ok) {
				if (response.status === 400) {
			    // Not found handler.
			    /*console.log('SIGNUP ERROR 400', response)
			    window.alert("REGISTERED_USER");*/
			    return callback('REGISTERED_USER')
			  } else {
			    // Other errors.
			    /*console.log('SIGNUP ERROR', response)
			    window.alert("SIGNUP FAIL");*/
			    return callback('SIGNUP FAIL')
			  }
			}
			else {
				window.alert('Sign Up Successful')
	      return response.json().then(user => ({ user, response }))
	    }
		}).then(({ user, response }) => {
    	// console.log('user', user)
    	// console.log('response', response)
      return callback(null, creds)
    })
}

export function requesterLogout(callback) {
	let config = {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json'},
		credentials: 'include'
	}
	fetch(pathLogout, config)
		.then(response => {
			if(!response.ok) {
				if (response.status === 401) {
			    // Not found handler.
			    /*console.log('SIGNUP ERROR 400', response)
			    window.alert("REGISTERED_USER");*/
			    return callback('Unauthorized')
			  } else {
			    // Other errors.
			    /*console.log('SIGNUP ERROR', response)
			    window.alert("SIGNUP FAIL");*/
			    return callback('LOGOUT_FAIL')
			  }
			}
			else {
				console.log('HAD LOGOUT')
	      return callback()
	    }
		})
}

/*export function requesterUserinfo(callback) {
	let config = {
		method: 'GET',
		headers: { 'Content-Type': 'application/json'},
		credentials: 'include'
	}
	fetch(pathGetUserinfo, config)
		.then(response =>
      	response.json().then(user => ({ user, response }))
	    ).then(({ user, response }) => {
	    	console.log('user', user)
	    	console.log('response', response)
	      if(response.status === 401) {
		    	return callback("Unauthorized")
		    }
		    else {
		    	if (!response.ok) {
			    	return callback(user.error)
		      }
		      else {
		      	return callback(null, user)
		      }
		    }
	    })
}*/

export function requesterUserinfo(callback) {
	let config = {
		method: 'GET',
		headers: { 'Content-Type': 'application/json'},
		credentials: 'include'
	}
	fetch(pathGetUserinfo, config)
		.then(response => {
			// console.log('response getUserInfo', response)
			if(!response.ok) {
				if(response.status === 401) {
					// console.log('error 401')
					return callback('Unauthorized')
				}
				return callback("GET_USER_INFO_FAILURE")
			}
			else {
				response.json().then(user => {
					return callback(null, user)
				})
			}
		})
}