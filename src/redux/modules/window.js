const KEY = 'window';
const LOGOUT = `${KEY}/logout-message`;

function logout() {
  return {
    type: LOGOUT,
  };
}

const actionTypes = {
  LOGOUT,
};
const actionCreators = {
  logout,
};

export {
  actionTypes,
  actionCreators,
};
