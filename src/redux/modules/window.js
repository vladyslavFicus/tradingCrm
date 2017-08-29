const KEY = 'window';
const LOGOUT = `${KEY}/logout-message`;
const CHANGE_LOCALE = `${KEY}/change-locale-message`;
const NOTIFICATION = `${KEY}/notification-message`;
const NAVIGATE_TO = `${KEY}/navigate-to`;
const VIEW_PLAYER_PROFILE = `${KEY}/view-player-profile`;
const SHOW_SCROLL_TO_TOP = `${KEY}/show-scroll-to-top`;
const SCROLL_TO_TOP = `${KEY}/scroll-to-top`;
const CLOSE_PROFILE_TAB = `${KEY}/close-profile-tab`;
const OPERATOR_ACTIVITY = `${KEY}/operator-activity`;

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

function showScrollToTop(isShow) {
  return {
    type: SHOW_SCROLL_TO_TOP,
    payload: isShow,
  };
}

function scrollToTop() {
  return {
    type: SCROLL_TO_TOP,
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

const actionTypes = {
  NOTIFICATION,
  CHANGE_LOCALE,
  LOGOUT,
  NAVIGATE_TO,
  SHOW_SCROLL_TO_TOP,
  SCROLL_TO_TOP,
  VIEW_PLAYER_PROFILE,
  CLOSE_PROFILE_TAB,
  OPERATOR_ACTIVITY,
};
const actionCreators = {
  changeLocale,
  logout,
  notify,
  navigateTo,
  viewPlayerProfile,
  showScrollToTop,
  scrollToTop,
  closeProfileTab,
  operatorActivity,
};

export {
  actionTypes,
  actionCreators,
};
