import { WEB_API, ContentType } from 'constants/index';
import { getTimestamp } from 'utils/helpers';
import { createRequestTypes } from 'utils/redux';

const KEY = 'bonus';
const CREATE_BONUS = createRequestTypes(`${KEY}/create`);

function createBonus(data) {
  return (dispatch, getState) => {
    const { token, uuid: currentUuid } = getState().auth;

    if (!token || !currentUuid) {
      return { type: false };
    }

    return dispatch({
      [WEB_API]: {
        method: 'POST',
        types: [CREATE_BONUS.REQUEST, CREATE_BONUS.SUCCESS, CREATE_BONUS.FAILURE],
        endpoint: `bonus/bonuses`,
        endpointParams: data,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    });
  };
}

const actionHandlers = {
  [CREATE_BONUS.REQUEST]: (state, action) => ({
    ...state,
    isLoading: true,
    isFailed: false,
  }),
  [CREATE_BONUS.SUCCESS]: (state, action) => ({
    ...state,
    isLoading: false,
    receivedAt: getTimestamp(),
  }),
  [CREATE_BONUS.FAILURE]: (state, action) => ({
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
    CREATE_BONUS,
};

const actionCreators = {
  createBonus,
};

export {
  actionTypes,
  actionCreators,
};

export default reducer;
