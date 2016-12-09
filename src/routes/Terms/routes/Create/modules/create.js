import { CALL_API } from 'redux-api-middleware';
import timestamp from 'utils/timestamp';
import buildQueryString from 'utils/buildQueryString';
import createRequestAction from 'utils/createRequestAction';

const KEY = 'terms-and-conditions';
const CREATE_TERMS = createRequestAction(`${KEY}/create`);

function createTerm(data) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/terms-and-conditions`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        types: [
          CREATE_TERMS.REQUEST,
          CREATE_TERMS.SUCCESS,
          CREATE_TERMS.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const actionHandlers = {
  [CREATE_TERMS.REQUEST]: (state, action) => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [CREATE_TERMS.SUCCESS]: (state, action) => ({
    ...state,
    isLoading: false,
    receivedAt: timestamp(),
  }),
  [CREATE_TERMS.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),
};

const initialState = {
  error: null,
  isLoading: false,
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

