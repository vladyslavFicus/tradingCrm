import { WEB_API, ContentType } from 'constants/index';
import { getTimestamp, localDateToString } from 'utils/helpers';
import { createRequestTypes } from 'utils/redux';

const KEY = 'term-view';
const FETCH_TERM = createRequestTypes(`${KEY}/campaign-fetch`);

function fetchTerm(id) {
  return (dispatch, getState) => {
    const { token, uuid: currentUuid } = getState().auth;

    if (!token || !currentUuid) {
      return { type: false };
    }

    return dispatch({
      [WEB_API]: {
        method: 'GET',
        types: [FETCH_TERM.REQUEST, FETCH_TERM.SUCCESS, FETCH_TERM.FAILURE],
        endpoint: `profile/terms-and-conditions/${id}`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    });
  };
}

const actionHandlers = {
  [FETCH_TERM.REQUEST]: (state, action) => ({
    ...state,
    error: null,
    isLoading: true,
    isFailed: false,
  }),
  [FETCH_TERM.SUCCESS]: (state, action) => ({
    ...state,
    data: { ...state.data, ...action.response },
  }),
  [FETCH_TERM.FAILURE]: (state, action) => ({
    ...state,
    error: action.error,
    isLoading: false,
    isFailed: true,
    receivedAt: getTimestamp(),
  }),
};

const initialState = {
  data: {},
  error: null,
  isLoading: false,
  isFailed: false,
  receivedAt: null,
};
function reducer(state = initialState, action) {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
}

const actionTypes = {
  FETCH_TERM,
};

const actionCreators = {
  fetchTerm,
};

export {
  actionTypes,
  actionCreators,
};

export default reducer;
