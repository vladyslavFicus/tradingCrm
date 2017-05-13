import { sendError, errorTypes } from '../../utils/errorLog';

const regExp = new RegExp('-failure$');

export default () => next => (action) => {
  if (action && action.error && regExp.test(action.type)) {
    const message = `${errorTypes.API} error`;
    const errorType = errorTypes.API;

    const error = {
      errorType,
      message,
      response: {
        error: errorType,
        error_description: message,
      },
    };

    if (action.type) {
      error.actionType = action.type;
    }

    if (action.payload && action.payload.status) {
      const errorCode = action.payload.status;
      error.errorCode = errorCode;
      error.response.error = errorCode;
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
