const KEY = 'window';
const LOGOUT = `${KEY}/logout-message`;
const CHANGE_LOCALE = `${KEY}/change-locale-message`;

function changeLocale(locale) {
  return {
    type: CHANGE_LOCALE,
    payload: locale,
  };
}

function logout() {
  return {
    type: LOGOUT,
  };
}

const actionTypes = {
  CHANGE_LOCALE,
  LOGOUT,
};
const actionCreators = {
  changeLocale,
  logout,
};

export {
  actionTypes,
  actionCreators,
};
