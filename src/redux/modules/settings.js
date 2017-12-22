import { REHYDRATE } from 'redux-persist/lib/constants';
import createReducer from '../../utils/createReducer';
import { playerProfileViewTypes } from '../../constants';

const KEY = 'settings';
const CHANGE_EMAIL_NOTIFICATION_SETTING = `${KEY}/change-email-notification-setting`;

function changeEmailNotificationSetting(payload) {
  return {
    type: CHANGE_EMAIL_NOTIFICATION_SETTING,
    payload,
  };
}

const initialState = {
  errorParams: {},
  sendMail: true,
  playerProfileViewType: __DEV__ ? playerProfileViewTypes.page : playerProfileViewTypes.frame,
};
const actionHandlers = {
  [CHANGE_EMAIL_NOTIFICATION_SETTING]: (state, action) => ({
    ...state,
    notifications: { ...state.notifications, email: action.payload },
  }),
  [REHYDRATE]: (state, action) => {
    if (action.payload.settings) {
      return {
        ...state,
        ...action.payload.settings,
        playerProfileViewType: (
          Object.keys(playerProfileViewTypes).indexOf(action.payload.settings.playerProfileViewType) === -1
        ) ? playerProfileViewTypes.frame : action.payload.settings.playerProfileViewType,
      };
    }

    return state;
  },
};
const actionCreators = {
  changeEmailNotificationSetting,
};
const actionTypes = {
  CHANGE_EMAIL_NOTIFICATION_SETTING,
};
export {
  initialState,
  actionHandlers,
  actionCreators,
  actionTypes,
};

export default createReducer(initialState, actionHandlers);
