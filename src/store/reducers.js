import { combineReducers } from 'redux';
import location from 'redux/modules/location';
import auth from 'redux/modules/auth';
import currency from 'redux/modules/currency';
import { reducer as formReducer } from 'redux-form';

export const makeRootReducer = (asyncReducers) => combineReducers({
  location,
  auth,
  currency,
  form: formReducer,
  ...asyncReducers,
});

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return;

  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
