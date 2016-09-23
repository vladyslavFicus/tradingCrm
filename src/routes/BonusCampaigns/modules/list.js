import { WEB_API } from 'constants/index';
import { getTimestamp } from 'utils/helpers';
import { createRequestTypes } from 'utils/redux';

const KEY = 'bonus-campaigns';
const FETCH_ENTITIES = createRequestTypes(`${KEY}/entities`);
const CHANGE_CAMPAIGN_STATE = createRequestTypes(`${KEY}/change-campaign-state`);

function fetchEntities(filters = {}) {
  return (dispatch, getState) => {
    const { token, uuid } = getState().auth;

    if (!token || !uuid) {
      return { type: false };
    }

    const endpointParams = {
      orderByPriority: true,
      page: 0,
    };

    if (filters.page !== undefined) {
      endpointParams.page = filters.page;
    }

    if (filters.state) {
      endpointParams.state = filters.state;
    }

    return dispatch({
      [WEB_API]: {
        method: 'GET',
        types: [
          FETCH_ENTITIES.REQUEST,
          FETCH_ENTITIES.SUCCESS,
          FETCH_ENTITIES.FAILURE,
        ],
        endpoint: `promotion/campaigns`,
        endpointParams,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    });
  };
}

function changeCampaignState(filters, state, id) {
  return (dispatch, getState) => {
    const { token, uuid } = getState().auth;

    if (!token || !uuid) {
      return { type: false };
    }

    return dispatch({
      [WEB_API]: {
        method: 'POST',
        types: [
          CHANGE_CAMPAIGN_STATE.REQUEST,
          CHANGE_CAMPAIGN_STATE.SUCCESS,
          CHANGE_CAMPAIGN_STATE.FAILURE,
        ],
        endpoint: `promotion/campaigns/${id}/${state}`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    }).then(() => dispatch(fetchEntities(filters)));
  };
}

const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: (state, action) => ({
    ...state,
    filters: { ...state.filters, ...action.filters },
    isLoading: true,
    isFailed: false,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, action) => ({
    ...state,
    entities: { ...action.response },
    isLoading: false,
    receivedAt: getTimestamp(),
  }),
  [FETCH_ENTITIES.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    isFailed: true,
    receivedAt: getTimestamp(),
  }),
};

const initialState = {
  entities: {
    first: null,
    last: null,
    number: null,
    numberOfElements: null,
    size: null,
    sort: null,
    totalElements: null,
    totalPages: null,
    content: [],
  },
  filters: {},
  isLoading: false,
  isFailed: false,
  receivedAt: null,
};
function reducer(state = initialState, action) {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
}

const actionTypes = {
  FETCH_ENTITIES,
  CHANGE_CAMPAIGN_STATE,
};

const actionCreators = {
  fetchEntities,
  changeCampaignState,
};

export {
  actionTypes,
  actionCreators,
};

export default reducer;
