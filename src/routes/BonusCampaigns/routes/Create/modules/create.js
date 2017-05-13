import createReducer from 'utils/createReducer';
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
        endpoint: 'promotion/campaigns',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...data, optIn: data.optIn || false }),
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
  [CAMPAIGN_CREATE.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [CAMPAIGN_CREATE.SUCCESS]: state => ({
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
const actionTypes = {
  CAMPAIGN_CREATE,
};
const actionCreators = {
  createCampaign,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
