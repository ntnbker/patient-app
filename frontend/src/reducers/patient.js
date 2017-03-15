import {
	LOAD_DETAIL_PATIENTS,
	LOAD_LIST_PATIENTS,
	UPDATE_DETAIL_PATIENT
} from '../actions/patient'

import {combineReducers} from 'redux'
function patient(state = {
	listPatient: [],
	detailPatient: {
		name: ''
	}
}, action) {
	switch(action.type) {
		case LOAD_LIST_PATIENTS:
			return {...state, ...action.payload}
		case LOAD_DETAIL_PATIENTS:
			return {...state, ...action.payload}
		case UPDATE_DETAIL_PATIENT:
			return {...state, ...action.payload}
		default:
			return state
	}
}
const data = combineReducers({
	patient
})

export default data
