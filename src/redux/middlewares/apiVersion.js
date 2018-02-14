import { actionCreators as modalActionCreators } from '../../redux/modules/modal';
import { types as modalTypes } from '../../constants/modals';

const regExp = new RegExp('-failure$');

export default store => next => (action) => {
  if (
    action && action.error && regExp.test(action.type)
    && action.payload && action.payload.status === 426
  ) {
    store.dispatch(modalActionCreators.open({ name: modalTypes.NEW_API_VERSION }));
  }

  return next(action);
};
