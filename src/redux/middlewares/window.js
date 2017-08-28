import { actionTypes as profileActionTypes } from '../../routes/UserProfile/modules/profile';
import { actionCreators as windowActionCreators } from '../modules/window';
import { actionTypes as userPanelsActionTypes } from '../modules/user-panels';
import { actionCreators as appActionCreators } from '../modules/app';

const config = {
  [profileActionTypes.FETCH_PROFILE.SUCCESS]: ({ payload }) => windowActionCreators.viewPlayerProfile({
    uuid: payload.playerUUID,
    firstName: payload.firstName,
    lastName: payload.lastName,
    username: payload.username,
  }),
  [profileActionTypes.SUBMIT_KYC.SUCCESS]: ({ payload }) => windowActionCreators.viewPlayerProfile({
    uuid: payload.playerUUID,
    firstName: payload.firstName,
    lastName: payload.lastName,
  }),
  [profileActionTypes.FETCH_PROFILE.FAILURE]: ({ payload, meta }) => (
    payload.status === 404
      ? windowActionCreators.closeProfileTab(meta.uuid)
      : undefined
  ),
  [userPanelsActionTypes.SET_ACTIVE]: payload => appActionCreators.setIsShowScrollTop(!!payload),
};

const allowedActions = Object.keys(config);
const isIframeVersion = window && window.parent !== window && window.parent.postMessage;

export default () => next => (action) => {
  const indexOfWindowAction = allowedActions.indexOf(action.type);

  if (isIframeVersion && action && indexOfWindowAction > -1) {
    const actionFunction = config[action.type];

    if (typeof actionFunction === 'function') {
      const windowActionMessage = actionFunction(action);

      if (windowActionMessage !== undefined) {
        window.parent.postMessage(JSON.stringify(windowActionMessage), window.location.origin);
      }
    }
  }

  return next(action);
};
