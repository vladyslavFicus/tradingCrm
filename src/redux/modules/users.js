import { WEB_API } from 'constants/index';
import { createRequestTypes } from 'utils/redux';

function fetchEntities(type) {
  return (filters = {}) => (dispatch, getState) => {
    const { token, uuid } = getState().auth;

    if (!token || !uuid) {
      return { type: false };
    }

    filters = Object.keys(filters).reduce((result, key) => {
      if (filters[key]) {
        result[key] = filters[key];
      }

      return result;
    }, {});

    const endpointParams = { page: 0, ...filters };

    return dispatch({
      [WEB_API]: {
        method: 'GET',
        types: [
          type.REQUEST,
          type.SUCCESS,
          type.FAILURE,
        ],
        endpoint: 'profile/profiles',
        endpointParams,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
      filters,
    });
  };
}

const initialState = {};

const actionHandlers = {};

const reducer = (state = initialState, action) => {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
};

const actionTypes = {};
const actionCreators = {
  fetchEntities,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default reducer;
