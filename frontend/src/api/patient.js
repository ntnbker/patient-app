import 'whatwg-fetch'
const domain = process.env.NODE_ENV === 'production' && 'https://pta-api.herokuapp.com/' || 'http://localhost:9000/'
const getDetailPatientPath = domain + 'v1/patient/'
const getListPatientPath = domain + 'v1/patients'
const updateProfilePath = domain + 'v1/patient/'
export function requestGetDetailPatient(_id, callback) {
  let config = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json'},
    credentials: 'include'
  }
  fetch(getDetailPatientPath + _id, config)
    .then(response =>
        response.json().then(json => ({ json, response }))
      ).then(({ json, response }) => {
        // console.log('json', json)
        // console.log('response', response)
        if (!response.ok) {
          return callback(json.error)
        }
        if(response.status === 400) {
          return callback(json.error)
        }
        else {
          return callback(null, json)
        }
      })  
}

export function requestGetListPatient(callback) {
  let config = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json'},
    credentials: 'include'
  }
  fetch(getListPatientPath, config)
    .then(response =>
        response.json().then(json => ({ json, response }))
      ).then(({ json, response }) => {
        // console.log('json', json)
        // console.log('response', response)
        if (!response.ok) {
          return callback(json.error)
        }
        if(response.status === 400) {
          return callback(json.error)
        }
        else {
          return callback(null, json)
        }
      })  
}

export function updateProfilePatient(_id, updates, callback) {
  let config = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ updates: updates  }),
    credentials: 'include'
  }
  fetch(updateProfilePath + _id, config)
    .then(response =>
        response.json().then(json => ({ json, response }))
      ).then(({ json, response }) => {
        // console.log('json', json)
        // console.log('response', response)
        if (!response.ok) {
          window.alert('ACCESS DENIED')
          return callback(json.error)
        }
        if(response.status === 400) {
          return callback(json.error)
        }
        else {
          window.alert('PROFILE SAVED')
          return callback(null, json)
        }
      })  
}

export function filterListPatient(conditions, skip, limit, callback) {
  let config = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }
  let url = getListPatientPath + '?conditions=' + JSON.stringify(conditions) + '&skip=' + skip + '&limit=' + limit;
  fetch(url, config)
    .then(response =>
        response.json().then(json => ({ json, response }))
      ).then(({ json, response }) => {
        // console.log('json', json)
        // console.log('response', response)
        if (!response.ok) {
          return callback(json.error)
        }
        if(response.status === 400) {
          return callback(json.error)
        }
        else {
          return callback(null, json)
        }
      })  
}