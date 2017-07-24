const KEY = 'window';
const LOGOUT = `${KEY}/logout-message`;
const CHANGE_LOCALE = `${KEY}/change-locale-message`;
const NOTIFICATION = `${KEY}/notification-message`;
const NAVIGATE_TO = `${KEY}/navigate-to`;
const SHOW_SCROLL_TO_TOP = `${KEY}/show-scroll-to-top`;
const SCROLL_TO_TOP = `${KEY}/scroll-to-top`;

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
    type: SHOW_SCROLL_TO_TOP,
    payload: userDetail,
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

const actionTypes = {
  NOTIFICATION,
  CHANGE_LOCALE,
  LOGOUT,
  NAVIGATE_TO,
  UPDATE_USER_TAB: SHOW_SCROLL_TO_TOP,
  SHOW_SCROLL_TO_TOP,
  SCROLL_TO_TOP,
};
const actionCreators = {
  changeLocale,
  logout,
  notify,
  navigateTo,
  updateUserTab,
  showScrollToTop,
  scrollToTop,
};

export {
  actionTypes,
  actionCreators,
};
