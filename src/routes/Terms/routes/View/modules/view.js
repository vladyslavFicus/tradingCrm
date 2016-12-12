import { CALL_API } from 'redux-api-middleware';
import timestamp from 'utils/timestamp';
import createRequestAction from 'utils/createRequestAction';

const KEY = 'term-view';
const FETCH_TERM = createRequestAction(`${KEY}/campaign-fetch`);

function fetchTerm(id) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/terms-and-conditions/${id}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [FETCH_TERM.REQUEST, FETCH_TERM.SUCCESS, FETCH_TERM.FAILURE],
        bailout: !logged,
      },
    });
  };
}

const actionHandlers = {
  [FETCH_TERM.REQUEST]: (state, action) => ({
    ...state,
    error: null,
    isLoading: true,
  }),
  [FETCH_TERM.SUCCESS]: (state, action) => ({
    ...state,
    isLoading: false,
    data: {
      ...state.data,
      ...action.payload,
    },
    receivedAt: timestamp(),
  }),
  [FETCH_TERM.FAILURE]: (state, action) => ({
    ...state,
    error: action.payload,
    isLoading: false,
    receivedAt: timestamp(),
  }),
};

const initialState = {
  data: {},
  error: null,
  isLoading: false,
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
