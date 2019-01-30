import { CALL_API, isValidRSAA } from 'redux-api-middleware';
import { getApiRoot, getApiVersion } from '../../config';

export default () => next => (action) => {
  const apiRoot = getApiRoot();

  if (isValidRSAA(action) && action[CALL_API].endpoint.indexOf(apiRoot) === -1) {
    return next({
      ...action,
      [CALL_API]: {
        ...action[CALL_API],
        headers: {
          ...action[CALL_API].headers,
          'X-CLIENT-Version': getApiVersion(),
        },
        endpoint: `${apiRoot}/${action[CALL_API].endpoint.replace(/^\//, '')}`,
      },
    });
  }

  return next(action);
};
