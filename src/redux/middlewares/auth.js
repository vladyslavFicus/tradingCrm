import { REHYDRATE } from 'redux-persist/constants';
import {
  actionTypes as authActionTypes,
  actionCreators as authActionCreators,
} from '../modules/auth';

const triggerActions = {
  start: [
    authActionTypes.SIGN_IN.SUCCESS,
    REHYDRATE,
  ],
  stop: [
    authActionTypes.LOGOUT.SUCCESS,
  ],
};
export default store => next => (action) => {
  if (action) {
    if (action.type === REHYDRATE) {
      if (action.payload.auth && action.payload.auth.isLoading) {
        action.payload.auth.isLoading = false;
      }
    }

    if (triggerActions.start.indexOf(action.type) > -1) {
      let auth = action.payload;
      if (action.type === REHYDRATE) {
        auth = action.payload.auth;
      }

      if (auth && auth.logged && auth.uuid && auth.token) {
        store.dispatch(authActionCreators.fetchProfile(auth.uuid, auth.token));
        store.dispatch(authActionCreators.fetchAuthorities(auth.uuid, auth.token));
      }
    }
  }

  return next(action);
};
