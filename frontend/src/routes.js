import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import Login from './components/auth/Login'
import DashBoard from './components/DashBoard'
import DetailPerson from './components/DetailPerson'
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
      <Route path="/dashboard" component={DashBoard}/>
      <Route path="/detail/:patient_id" component={DetailPerson}/>
		</Route>
  );
};