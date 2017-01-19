import { applyMiddleware, compose, createStore } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import { browserHistory } from 'react-router';
import { persistStore, autoRehydrate } from 'redux-persist';
import thunk from 'redux-thunk';
import makeRootReducer from './reducers';
import apiUrl from 'redux/middlewares/apiUrl';
import { actionCreators as locationActionCreators } from 'redux/modules/location';
import unauthorized from 'redux/middlewares/unauthorized';
import refreshToken from 'redux/middlewares/refreshToken';
import config from 'config/index';

export default (initialState = {}, onComplete) => {
  const middleware = [
    thunk,
    apiUrl,
    apiMiddleware,
    unauthorized(config.middlewares.unauthorized),
    refreshToken(),
  ];

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = [autoRehydrate()];
  let composeEnhancers = compose;

  if (__DEV__) {
    const composeWithDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    if (typeof composeWithDevToolsExtension === 'function') {
      composeEnhancers = composeWithDevToolsExtension;
    }
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
      ...enhancers
    )
  );
  persistStore(store, config.middlewares.persist, () => {
    onComplete(store);
  });

  store.asyncReducers = {};
  store.unsubscribeHistory = browserHistory
    .listen(locationActionCreators.updateLocation(store));

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default;
      store.replaceReducer(reducers(store.asyncReducers));
    });
  }
};
