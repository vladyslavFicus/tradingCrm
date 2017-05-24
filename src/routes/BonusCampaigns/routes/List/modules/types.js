import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';

const KEY = 'bonusCampaigns/types';
const FETCH_TYPES = createRequestAction(`${KEY}/fetch-types`);

function fetchTypes() {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: 'promotion/campaigns/types',
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          FETCH_TYPES.REQUEST,
          FETCH_TYPES.SUCCESS,
          FETCH_TYPES.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const initialState = {
  list: [],
  error: null,
  isLoading: false,
  receivedAt: null,
};
const actionHandlers = {
  [FETCH_TYPES.REQUEST]: (state) => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_TYPES.SUCCESS]: (state, action) => ({
    ...state,
    list: action.payload,
    isLoading: false,
  }),
  [FETCH_TYPES.FAILURE]: (state, action) => ({
    ...state,
    error: action.payload,
    isLoading: false,
  }),
};
const actionTypes = {
  FETCH_TYPES,
};
const actionCreators = {
  fetchTypes,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
