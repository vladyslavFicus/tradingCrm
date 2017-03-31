import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import location from '../redux/modules/location';
import auth from '../redux/modules/auth';
import permissions from '../redux/modules/permissions';

export const makeRootReducer = asyncReducers => combineReducers({
  location,
  auth,
  permissions,
  form: formReducer,
  ...asyncReducers,
});

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return;

  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
