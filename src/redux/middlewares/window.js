import { actionTypes as profileActionTypes } from '../../routes/UserProfile/modules/profile';
import { actionCreators as windowActionCreators } from '../modules/window';
import { actionTypes as userPanelsActionTypess } from '../modules/user-panels';
import { actionCreators as appActionCreators } from '../modules/app';

const config = {
  [profileActionTypes.PROFILE.SUCCESS]: windowActionCreators.updateUserTab,
  [profileActionTypes.SUBMIT_KYC.SUCCESS]: windowActionCreators.updateUserTab,
  [userPanelsActionTypess.SET_ACTIVE]: appActionCreators.setIsShowScrollTop,
};

const allowedActions = Object.keys(config);
const isIframeVersion = window && window.parent !== window && window.parent.postMessage;

export default () => next => (action) => {
  const indexOfWindowAction = allowedActions.indexOf(action.type);

  if (isIframeVersion && action && indexOfWindowAction > -1) {
    let data;
    const actionFunction = config[action.type];

    if (action.type === profileActionTypes.PROFILE.SUCCESS || action.type === profileActionTypes.SUBMIT_KYC.SUCCESS) {
      data = {
        uuid: action.payload.uuid,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
      };
    }

    if (action.type === userPanelsActionTypess.SET_ACTIVE && action.payload) {
      data = true;
    } else if (action.type === userPanelsActionTypess.SET_ACTIVE && !action.payload) {
      data = false;
    }

    window.parent.postMessage(JSON.stringify(actionFunction(data)), window.location.origin);
  }

  return next(action);
};
