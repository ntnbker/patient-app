import React from 'react';
import ReactDOM from 'react-dom';
import './css/main.css';
import { Provider } from 'react-redux';
import createRoutes from './routes';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './store/configureStore';
const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);
const routes = createRoutes(store);
console.log('test')
ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('root')
);
