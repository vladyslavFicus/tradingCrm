import { CALL_API } from 'redux-api-middleware';
import timestamp from 'utils/timestamp';
import createRequestAction from 'utils/createRequestAction';

const KEY = 'campaign';
const CAMPAIGN_CREATE = createRequestAction(`${KEY}/campaign-create`);

function createCampaign(data) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `promotion/campaigns`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        types: [
          CAMPAIGN_CREATE.REQUEST,
          CAMPAIGN_CREATE.SUCCESS,
          CAMPAIGN_CREATE.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const actionHandlers = {
  [CAMPAIGN_CREATE.REQUEST]: (state, action) => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [CAMPAIGN_CREATE.SUCCESS]: (state, action) => ({
    ...state,
    isLoading: false,
    receivedAt: timestamp(),
  }),
  [CAMPAIGN_CREATE.FAILURE]: (state, action) => ({
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
  CAMPAIGN_CREATE,
};

const actionCreators = {
  createCampaign,
};

export {
  actionTypes,
  actionCreators,
};

export default reducer;
