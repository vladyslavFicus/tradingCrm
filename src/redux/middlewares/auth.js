import jwtDecode from 'jwt-decode';
import { REHYDRATE } from 'redux-persist/constants';
import {
  actionTypes as authActionTypes,
  actionCreators as authActionCreators,
} from '../modules/auth';

const triggerActions = {
  start: [
    authActionTypes.SIGN_IN.SUCCESS,
    authActionTypes.CHANGE_AUTHORITY.SUCCESS,
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

      if (auth && auth.token) {
        const tokenData = jwtDecode(auth.token);

        if (window.app.brandId !== tokenData.brandId) {
          window.app.brandId = tokenData.brandId;
        }
      }

      if (window.Raven) {
        window.Raven.setUserContext({
          uuid: auth.uuid,
        });
      }

      const isAuthRehydrate = !!action.payload.language;
      if (auth && auth.uuid && auth.token && isAuthRehydrate) {
        store.dispatch(authActionCreators.fetchProfile(auth.uuid, auth.token));
        store.dispatch(authActionCreators.fetchAuthorities(auth.uuid, auth.token));
      }
    } else if (triggerActions.stop.indexOf(action.type) > -1) {
      window.app.brandId = null;
    }
  }

  return next(action);
};
