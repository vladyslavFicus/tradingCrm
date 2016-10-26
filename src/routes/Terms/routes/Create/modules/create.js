import { WEB_API, ContentType } from 'constants/index';
import { getTimestamp } from 'utils/helpers';
import { createRequestTypes } from 'utils/redux';

const KEY = 'terms-and-conditions';
const CREATE_TERMS = createRequestTypes(`${KEY}/create`);

function createTerm(data) {
  return (dispatch, getState) => {
    const { token, uuid: currentUuid } = getState().auth;

    if (!token || !currentUuid) {
      return { type: false };
    }

    return dispatch({
      [WEB_API]: {
        method: 'POST',
        types: [CREATE_TERMS.REQUEST, CREATE_TERMS.SUCCESS, CREATE_TERMS.FAILURE],
        endpoint: `profile/terms-and-conditions`,
        endpointParams: data,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    });
  };
}

const actionHandlers = {
  [CREATE_TERMS.REQUEST]: (state, action) => ({
    ...state,
    isLoading: true,
    isFailed: false,
  }),
  [CREATE_TERMS.SUCCESS]: (state, action) => ({
    ...state,
    isLoading: false,
    receivedAt: getTimestamp(),
  }),
  [CREATE_TERMS.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    isFailed: true,
    receivedAt: getTimestamp(),
  }),
};

const initialState = {
  isLoading: false,
  isFailed: false,
  receivedAt: null,
};
function reducer(state = initialState, action) {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
}

const actionTypes = {
  CREATE_TERMS,
};

const actionCreators = {
  createTerm,
};

export {
  actionTypes,
  actionCreators,
};

export default reducer;
