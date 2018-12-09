import { actionTypes as profileActionTypes } from '../../routes/Clients/routes/Profile/modules/profile';
import { actionCreators as windowActionCreators } from '../modules/window';

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
};

const allowedActions = Object.keys(config);
const isIframeVersion = window.isFrame;

export default () => next => (action) => {
  const indexOfWindowAction = allowedActions.indexOf(action.type);

  if (isIframeVersion && action && indexOfWindowAction > -1) {
    const actionFunction = config[action.type];

    if (typeof actionFunction === 'function') {
      const windowActionMessage = actionFunction(action);

      if (windowActionMessage !== undefined) {
        window.dispatchAction(windowActionMessage);
      }
    }
  }

  return next(action);
};
