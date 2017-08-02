import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { i18nReducer } from 'react-redux-i18n';
import location from '../redux/modules/location';
import auth from '../redux/modules/auth';
import permissions from '../redux/modules/permissions';
import userPanels from '../redux/modules/user-panels';
import language from '../redux/modules/language';
import app from '../redux/modules/app';

export const makeRootReducer = asyncReducers => combineReducers({
  location,
  auth,
  permissions,
  userPanels,
  language,
  app,
  form: formReducer,
  i18n: i18nReducer,
  ...asyncReducers,
});

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return;

  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
