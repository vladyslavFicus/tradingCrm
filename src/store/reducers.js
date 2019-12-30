import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from '../redux/modules/auth';
import authorities from '../redux/modules/auth/authorities';
import permissions from '../redux/modules/auth/permissions';
import app from '../redux/modules/app';
import modal from '../redux/modules/modal';
import notifications from '../redux/modules/notifications';
import dynamicFilters from '../components/DynamicFilters/reduxModule';

export const makeRootReducer = asyncReducers => combineReducers({
  auth,
  authorities,
  permissions,
  app,
  notifications,
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
