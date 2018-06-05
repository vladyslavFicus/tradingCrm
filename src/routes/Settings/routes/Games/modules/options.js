import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import { getBrandId } from '../../../../../config';

const KEY = 'options';
const FETCH_GAME_AGGREGATORS = createRequestAction(`${KEY}/fetch-game-aggregators`);

const actionHandlers = {
  [FETCH_GAME_AGGREGATORS.SUCCESS]: (state, {
    payload,
  }) => ({
    ...state,
    aggregators: payload,
  }),
};

function fetchGameAggregators() {
  return {
    [CALL_API]: {
      endpoint: `game_info/public/available/aggregatorIds?brandId=${getBrandId()}`,
      method: 'OPTIONS',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      types: [
        FETCH_GAME_AGGREGATORS.REQUEST,
        FETCH_GAME_AGGREGATORS.SUCCESS,
        FETCH_GAME_AGGREGATORS.FAILURE,
      ],
    },
  };
}

const initialState = {
  aggregators: [],
};
const actionTypes = {};
const actionCreators = {
  fetchGameAggregators,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
