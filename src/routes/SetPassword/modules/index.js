import { sourceActionCreators } from 'redux/modules/operator';
import createReducer from 'utils/createReducer';
import createRequestAction from 'utils/createRequestAction';

const KEY = 'set-password';
const SET_NEW_PASSWORD = createRequestAction(`${KEY}/set-new-password`);

const setNewPassword = sourceActionCreators.passwordResetConfirm(SET_NEW_PASSWORD);

const initialState = {};
const actionHandlers = {};
const actionTypes = {
  SET_NEW_PASSWORD,
};
const actionCreators = {
  setNewPassword,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
