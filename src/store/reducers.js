import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from '../redux/modules/auth';
import authorities from '../redux/modules/auth/authorities';
import permissions from '../redux/modules/auth/permissions';
import modal from '../redux/modules/modal';
import dynamicFilters from '../components/DynamicFilters/reduxModule';

export const makeRootReducer = asyncReducers => combineReducers({
  auth,
  authorities,
  permissions,
  modal,
  form: formReducer,
  dynamicFilters,
  ...asyncReducers,
});

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return;

  store.asyncReducers[key] = reducer; // eslint-disable-line
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
