import { CALL_API, isValidRSAA } from 'redux-api-middleware';
import { getApiRoot } from 'config/index';

export default store => next => action => {
  const apiRoot = getApiRoot();

  if (isValidRSAA(action) && action[CALL_API].endpoint.indexOf(apiRoot) === -1) {
    action[CALL_API].endpoint = `${apiRoot}/${action[CALL_API].endpoint.replace(/^\//, '')}`;
  }

  return next(action);
};
