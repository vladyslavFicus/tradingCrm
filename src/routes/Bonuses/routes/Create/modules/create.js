import { CALL_API } from 'redux-api-middleware';
import timestamp from 'utils/timestamp';
import createRequestAction from 'utils/createRequestAction';
import { types } from 'constants/bonus';

const KEY = 'bonus';
const CREATE_BONUS = createRequestAction(`${KEY}/create`);

function createBonus(data) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `bonus/bonuses`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...data, bonusType: types.Manual }),
        types: [
          CREATE_BONUS.REQUEST,
          CREATE_BONUS.SUCCESS,
          CREATE_BONUS.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const actionHandlers = {
  [CREATE_BONUS.REQUEST]: (state, action) => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [CREATE_BONUS.SUCCESS]: (state, action) => ({
    ...state,
    isLoading: false,
    receivedAt: timestamp(),
  }),
  [CREATE_BONUS.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),
};

const initialState = {
  isLoading: false,
  error: null,
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
