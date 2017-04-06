import { sendError, errorTypes } from '../../utils/errorLog';

const regExp = new RegExp('-failure$');

export default () => next => (action) => {
  if (action.error && regExp.test(action.type)) {
    const error = {
      errorType: errorTypes.API,
      message: `${errorTypes.API} error`,
    };

    if (action.type) {
      error.actionType = action.type;
    }

    if (action.payload && action.payload.status) {
      error.errorCode = action.payload.status;
    }

    if (action.payload && action.payload.response) {
      error.response = action.payload.response;
    }

    if (action.payload && action.payload.response && action.payload.response.error) {
      error.message = action.payload.response.error;
    }

    sendError(error);
  }

  return next(action);
};
