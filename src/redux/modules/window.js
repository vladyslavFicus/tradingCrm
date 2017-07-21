const KEY = 'window';
const LOGOUT = `${KEY}/logout-message`;
const CHANGE_LOCALE = `${KEY}/change-locale-message`;
const NOTIFICATION = `${KEY}/notification-message`;
const NAVIGATE_TO = `${KEY}/navigate-to`;
const UPDATE_USER_TAB = `${KEY}/update-user-tab`;

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

function updateUserTab(userDetail) {
  return {
    type: UPDATE_USER_TAB,
    payload: userDetail,
  };
}

const actionTypes = {
  NOTIFICATION,
  CHANGE_LOCALE,
  LOGOUT,
  NAVIGATE_TO,
  UPDATE_USER_TAB,
};
const actionCreators = {
  changeLocale,
  logout,
  notify,
  navigateTo,
  updateUserTab,
};

export {
  actionTypes,
  actionCreators,
};
