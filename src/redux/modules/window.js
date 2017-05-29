const KEY = 'window';
const LOGOUT = `${KEY}/logout-message`;
const CHANGE_LOCALE = `${KEY}/change-locale-message`;
const NOTIFICATION = `${KEY}/notification-message`;

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

const actionTypes = {
  NOTIFICATION,
  CHANGE_LOCALE,
  LOGOUT,
};
const actionCreators = {
  changeLocale,
  logout,
  notify,
};

export {
  actionTypes,
  actionCreators,
};
