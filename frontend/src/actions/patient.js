import { push } from 'react-router-redux'
import { 
  requestGetDetailPatient,
  requestGetListPatient, 
  updateProfilePatient, 
  filterListPatient 
} from '../api/patient'

export const LOAD_DETAIL_PATIENTS = 'LOAD_DETAIL_PATIENTS_SUCCESS'
export const LOAD_LIST_PATIENTS = 'LOAD_LIST_PATIENTS_SUCCESS'
export const UPDATE_DETAIL_PATIENT = 'UPDATE_DETAIL_PATIENT'
export function loadDetailPatient(_id) {
  return (dispatch) => {
      requestGetDetailPatient(_id, (err, result) => {
        dispatch({
          type: LOAD_DETAIL_PATIENTS,
          payload: {
            detailPatient: result
          }
        })
      })
  }
}

export function loadListPatient() {
  return (dispatch) => {
      requestGetListPatient((err, result) => {
        dispatch({
          type: LOAD_LIST_PATIENTS,
          payload: {
            listPatient: result
          }
        })
      })
  }
}

export function updateDetailpatient(_id, updates) {
  return (dispatch) => {
    updateProfilePatient(_id, updates, (err, result) => {
      if (err) {
        window.alert(err)
        return dispatch(push('/detail/' + _id))
      }
      dispatch({
        type: UPDATE_DETAIL_PATIENT,
        payload: {
          detailPatient: result
        }
      })
    })
  }
}

export function findListPatient(conditions, skip, limit) {
  return (dispatch) => {
    filterListPatient(conditions, skip, limit, (err, result) => {
      if (err) {
        return dispatch(push('/dashboard'))
      }
      dispatch({
        type: LOAD_LIST_PATIENTS,
        payload: {
          listPatient: result
        }
      })
    })
  }
}

export function dashboard() {
  return (dispatch) => {
    dispatch(push('/dashboard'));
  }
}