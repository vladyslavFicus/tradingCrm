import { actionCreators as authActionCreators } from '../../../redux/modules/auth';
import createReducer from '../../../utils/createReducer';
import createRequestAction from '../../../utils/createRequestAction';

const KEY = 'reset-password';
const RESET_PASSWORD_CONFIRM = createRequestAction(`${KEY}/confirm`);

const resetPasswordConfirm = authActionCreators.resetPasswordConfirm(RESET_PASSWORD_CONFIRM);

const initialState = {};
const actionHandlers = {};
const actionTypes = {
  RESET_PASSWORD_CONFIRM,
};
const actionCreators = {
  resetPasswordConfirm,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
