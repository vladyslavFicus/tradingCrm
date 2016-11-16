import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import auth from '../redux/modules/auth';
import { reducer as formReducer } from 'redux-form';

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    router,
    auth,
    form: formReducer,
    ...asyncReducers,
  });
};

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
