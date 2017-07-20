import { actionTypes as profileActionTypes } from '../../routes/UserProfile/modules/profile';
import { actionTypes as windowActionTypes } from '../modules/window';


export default store => next => (action) => {
  if (action) {
    if ((action.type === profileActionTypes.PROFILE.SUCCESS || action.type === profileActionTypes.SUBMIT_KYC.SUCCESS) &&
      window && window.parent !== window && window.parent.postMessage) {
      const { uuid, firstName, lastName } = action.payload;

      window.parent.postMessage(JSON.stringify({
        type: windowActionTypes.UPDATE_USER_TAB,
        payload: { uuid, firstName, lastName },
      }), window.origin);
    }
  }

  return next(action);
};
