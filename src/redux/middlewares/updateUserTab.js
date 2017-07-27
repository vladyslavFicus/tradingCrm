import { actionTypes as profileActionTypes } from '../../routes/UserProfile/modules/profile';
import { actionTypes as windowActionTypes } from '../modules/window';

const allowedActions = [
  profileActionTypes.FETCH_PROFILE.SUCCESS,
  profileActionTypes.SUBMIT_KYC.SUCCESS,
];
const isIframeVersion = window && window.parent !== window && window.parent.postMessage;
export default () => next => (action) => {
  if (isIframeVersion && action && allowedActions.indexOf(action.type) > -1) {
    const { uuid, firstName, lastName } = action.payload;

    window.parent.postMessage(JSON.stringify({
      type: windowActionTypes.UPDATE_USER_TAB,
      payload: { uuid, firstName, lastName },
    }), window.location.origin);
  }

  return next(action);
};
