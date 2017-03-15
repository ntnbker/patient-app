import { createStore, applyMiddleware }  from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from '../reducers'
// routerMiddleWare for listen dispatch(push)
import {routerMiddleware} from 'react-router-redux';
import {browserHistory} from 'react-router'
const loggerMiddleware = createLogger()

export default function configureStore(preloadedState) {
	return createStore(
		rootReducer,
		preloadedState,
		applyMiddleware(
			routerMiddleware(browserHistory),
			thunk,
			loggerMiddleware
		)
	)
}