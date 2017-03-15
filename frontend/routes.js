import React from 'react';
import { getUserInfo } from './actions/auth'
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import Login from './components/auth/Login'

export default (store) => {

  /*const redirectId = (nextState, replace, callback) => {
    const { practice: { isFetching, status }} = store.getState();
    console.log('redirect practice', status);
    if ( isFetching ) {
      replace({
        pathname: '/practice'
      });
    }
    callback();
  };*/
  return (
    	<Route path="/" component={App}>
			<IndexRoute component={Login} />
      <Route path="/login" component={Login} />
		</Route>
  );
};