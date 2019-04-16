const KEY = 'window';
const LOGOUT = `${KEY}/logout-message`;
const CHANGE_LOCALE = `${KEY}/change-locale-message`;
const NOTIFICATION = `${KEY}/notification-message`;
const NAVIGATE_TO = `${KEY}/navigate-to`;
const VIEW_PLAYER_PROFILE = `${KEY}/view-player-profile`;
const CLOSE_PROFILE_TAB = `${KEY}/close-profile-tab`;
const OPERATOR_ACTIVITY = `${KEY}/operator-activity`;
const UPDATE_CLIENT_LIST = `${KEY}/update-client-list`;

function changeLocale(locale) {
  return {
    type: CHANGE_LOCALE,
    payload: locale,
  };
}

function notify(payload) {
  return {
    type: NOTIFICATION,
    payload,
  };
}

function logout() {
  return {
    type: LOGOUT,
  };
}

function navigateTo(to) {
  return {
    type: NAVIGATE_TO,
    payload: to,
  };
}

function viewPlayerProfile(payload) {
  return {
    type: VIEW_PLAYER_PROFILE,
    payload,
  };
}

function closeProfileTab(userUUID) {
  return {
    type: CLOSE_PROFILE_TAB,
    payload: userUUID,
  };
}

function operatorActivity() {
  return { type: OPERATOR_ACTIVITY };
}

function updateClientList() {
  return { type: UPDATE_CLIENT_LIST };
}

const actionTypes = {
  NOTIFICATION,
  CHANGE_LOCALE,
  LOGOUT,
  NAVIGATE_TO,
  VIEW_PLAYER_PROFILE,
  CLOSE_PROFILE_TAB,
  OPERATOR_ACTIVITY,
  UPDATE_CLIENT_LIST,
};
const actionCreators = {
  changeLocale,
  logout,
  notify,
  navigateTo,
  viewPlayerProfile,
  closeProfileTab,
  operatorActivity,
  updateClientList,
};

export {
  actionTypes,
  actionCreators,
};
