import { actionTypes } from '../modules/auth';
import { actionTypes as windowActionTypes, actionCreators as windowActionCreators } from '../modules/window';

export default (codes = [401]) => {
  const isValidMiddlewareAction = ({ auth }, action) => auth.logged && action
    && (
      (action.error && action.payload && codes.indexOf(action.payload.status) > -1)
      || action.type === windowActionTypes.LOGOUT
    );

  return ({ dispatch, getState }) => next => (action) => {
    const { auth } = getState();

    if (isValidMiddlewareAction({ auth }, action)) {
      if (window.isFrame) {
        window.dispatchAction(windowActionCreators.logout());
      } else {
        dispatch({ type: actionTypes.LOGOUT.SUCCESS });
      }
    }

    return next(action);
  };
};
