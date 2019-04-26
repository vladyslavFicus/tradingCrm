import { CALL_API } from 'redux-api-middleware';
import buildQueryString from '../../../utils/buildQueryString';

function fetchEntities(type) {
  return (uuid, filters = {}) => (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `auth/signin/history/${uuid}?${buildQueryString(filters)}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        types: [
          {
            type: type.REQUEST,
            meta: { filters },
          },
          type.SUCCESS,
          type.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const sourceActionCreators = {
  fetchEntities,
};

export {
  sourceActionCreators,
};
