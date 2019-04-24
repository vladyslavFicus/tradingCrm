import { actionCreators as modalActionCreators } from '../../redux/modules/modal';
import { types as modalTypes } from '../../constants/modals';

const regExp = new RegExp('-failure$');

export default (store) => {
  window.app.onApiVersionChanged = () => store.dispatch(modalActionCreators.open({ name: modalTypes.NEW_API_VERSION }));

  return next => (action) => {
    if (
      !window.isFrame &&
      action && action.error && regExp.test(action.type)
      && action.payload && action.payload.status === 426
    ) {
      console.log('IN API VERSION REDUX MIDDLEWARE', action.payload);
      window.app.onApiVersionChanged();
    }

    return next(action);
  };
};
