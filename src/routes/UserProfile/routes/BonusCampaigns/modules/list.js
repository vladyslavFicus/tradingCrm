import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import timestamp from '../../../../../utils/timestamp';
import buildQueryString from '../../../../../utils/buildQueryString';
import { sourceActionCreators as noteSourceActionCreators } from '../../../../../redux/modules/note';
import { targetTypes } from '../../../../../constants/note';
import { types as bonusTypes } from '../../../../../constants/bonus';

const KEY = 'user/bonus-campaign/list';
const FETCH_ENTITIES = createRequestAction(`${KEY}/entities`);

function fetchAvailableCampaignList(playerUUID) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `promotion/campaigns/${playerUUID}/available`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          FETCH_ENTITIES.REQUEST,
          FETCH_ENTITIES.SUCCESS,
          FETCH_ENTITIES.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: (state, action) => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, action) => ({
    ...state,
    entities: action.payload,
    isLoading: false,
    receivedAt: timestamp(),
  }),
  [FETCH_ENTITIES.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),
};
const initialState = {
  entities: [],
  error: null,
  isLoading: false,
  receivedAt: null,
};
const actionTypes = {
  FETCH_ENTITIES,
};
const actionCreators = {
  fetchAvailableCampaignList,
};

export {
  actionTypes,
  actionCreators,
  initialState,
};

export default createReducer(initialState, actionHandlers);
