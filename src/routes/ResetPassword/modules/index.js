import createReducer from 'utils/createReducer';
import { sourceActionCreators } from  'redux/modules/operator';
import createRequestAction from 'utils/createRequestAction';

const KEY = 'reset-password';
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
