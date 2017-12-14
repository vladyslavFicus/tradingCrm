import createReducer from 'utils/createReducer';
import { CALL_API } from 'redux-api-middleware';
import timestamp from 'utils/timestamp';
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
  [CREATE_TERMS.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [CREATE_TERMS.SUCCESS]: (state, { meta: { endRequestTime } }) => ({
    ...state,
    isLoading: false,
    receivedAt: endRequestTime,
  }),
  [CREATE_TERMS.FAILURE]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    isLoading: false,
    error: payload,
    receivedAt: endRequestTime,
  }),
};
const initialState = {
  error: null,
  isLoading: false,
  receivedAt: null,
};
const actionTypes = {
  CREATE_TERMS,
};
const actionCreators = {
  createTerm,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);

