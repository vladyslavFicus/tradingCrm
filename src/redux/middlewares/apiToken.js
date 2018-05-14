import { CALL_API, isValidRSAA } from 'redux-api-middleware';
import getSignInUrl from '../../utils/getSignInUrl';
import { actionTypes as authActionTypes } from '../modules/auth';
import { actionCreators as windowActionCreators } from '../modules/window';

export default store => next => (action) => {
  if (isValidRSAA(action)) {
    if (
      action[CALL_API].headers
      && action[CALL_API].headers.Authorization
      && action[CALL_API].headers.Authorization.match(/bearer null/i)
    ) {
      if (window.isFrame) {
        window.dispatchAction(windowActionCreators.logout());

        return;
      }

      store.dispatch({ type: authActionTypes.LOGOUT.SUCCESS });
      const signInUrl = getSignInUrl(store.getState().location);

      if (signInUrl) {
        browserHistory.push(signInUrl);

        return;
      }
    }
  }

  return next(action);
};
