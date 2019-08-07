import jwtDecode from 'jwt-decode';
import { REHYDRATE } from 'redux-persist/constants';
import {
  actionTypes as authActionTypes,
  actionCreators as authActionCreators,
} from '../modules/auth';
import { getBrandId, setBrandId } from '../../config';

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
        action.payload.auth.isLoading = false; // eslint-disable-line
      }
    }

    if (triggerActions.start.indexOf(action.type) > -1) {
      let auth = action.payload;

      if (action.type === REHYDRATE) {
        ({ auth } = action.payload);
      }

      if (auth && auth.token) {
        const tokenData = jwtDecode(auth.token);

        if (getBrandId() !== tokenData.brandId) {
          setBrandId(tokenData.brandId);
        }
      }

      const isAuthRehydrate = !!action.payload.language;

      if (auth && auth.uuid && auth.token && isAuthRehydrate) {
        store.dispatch(authActionCreators.fetchProfile(auth.uuid, auth.token));
        store.dispatch(authActionCreators.fetchAuthorities(auth.uuid, auth.token));
      }
    } else if (triggerActions.stop.indexOf(action.type) > -1) {
      setBrandId(null);
    }
  }

  return next(action);
};
