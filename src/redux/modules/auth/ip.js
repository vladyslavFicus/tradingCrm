import { CALL_API } from 'redux-api-middleware';
import buildQueryString from '../../../utils/buildQueryString';

function fetchEntities(type) {
  return (uuid, filters = {}) => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `auth/signin/history/${uuid}?${buildQueryString(filters)}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
