import { WEB_API, ContentType } from 'constants/index';
import { getTimestamp } from 'utils/helpers';

const KEY = 'campaign';
const CAMPAIGN_CREATE_REQUEST = `${KEY}/campaign-create-request`;
const CAMPAIGN_CREATE_SUCCESS = `${KEY}/campaign-create-success`;
const CAMPAIGN_CREATE_FAILURE = `${KEY}/campaign-create-failure`;

function createCampaign(data) {
  return (dispatch, getState) => {
    const { token, uuid: currentUuid } = getState().auth;

    if (!token || !currentUuid) {
      return { type: false };
    }

    return dispatch({
      [WEB_API]: {
        method: 'POST',
        types: [CAMPAIGN_CREATE_REQUEST, CAMPAIGN_CREATE_SUCCESS, CAMPAIGN_CREATE_FAILURE],
        endpoint: `promotion/campaigns`,
        endpointParams: data,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    });
  };
}

const actionHandlers = {
  [CAMPAIGN_CREATE_REQUEST]: (state, action) => ({
    ...state,
    isLoading: true,
    isFailed: false,
  }),
  [CAMPAIGN_CREATE_SUCCESS]: (state, action) => ({
    ...state,
    isLoading: false,
    receivedAt: getTimestamp(),
  }),
  [CAMPAIGN_CREATE_FAILURE]: (state, action) => ({
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
  CAMPAIGN_CREATE_REQUEST,
  CAMPAIGN_CREATE_SUCCESS,
  CAMPAIGN_CREATE_FAILURE,
};

const actionCreators = {
  createCampaign,
};

export {
  actionTypes,
  actionCreators,
};

export default reducer;
