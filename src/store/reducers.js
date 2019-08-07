import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { i18nReducer } from 'react-redux-i18n';
import auth from '../redux/modules/auth';
import authorities from '../redux/modules/auth/authorities';
import permissions from '../redux/modules/auth/permissions';
import userPanels from '../redux/modules/user-panels';
import language from '../redux/modules/language';
import app from '../redux/modules/app';
import settings from '../redux/modules/settings';
import options from '../redux/modules/profile/options';
import modal from '../redux/modules/modal';
import notifications from '../redux/modules/notifications';
import dynamicFilters from '../components/DynamicFilters/reduxModule';
import transactions from '../redux/modules/transactions';

export const makeRootReducer = asyncReducers => combineReducers({
  auth,
  authorities,
  permissions,
  userPanels,
  language,
  app,
  settings,
  options,
  notifications,
  modal,
  form: formReducer,
  i18n: i18nReducer,
  dynamicFilters,
  transactions,
  ...asyncReducers,
});

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return;

  store.asyncReducers[key] = reducer; // eslint-disable-line
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
