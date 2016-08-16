import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import auth from '../redux/modules/auth';

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    router,
    auth,
    ...asyncReducers
  })
};

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
}

export default makeRootReducer;
