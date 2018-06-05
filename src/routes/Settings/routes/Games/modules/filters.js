import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../utils/createReducer';
import { type, withLines } from '../../../../../constants/games';
import createRequestAction from '../../../../../utils/createRequestAction';
import { getBrandId } from '../../../../../config';

const KEY = 'filters';
const FETCH_GAME_PROVIDERS = createRequestAction(`${KEY}/fetch-game-providers`);

const actionHandlers = {
  [FETCH_GAME_PROVIDERS.SUCCESS]: (state, { payload }) => ({
    ...state,
    data: {
      ...state.data,
      gameProvider: payload,
    },
    isLoading: true,
    error: null,
    noResults: false,
  }),
};

function fetchGameProviders() {
  return {
    [CALL_API]: {
      endpoint: `game_info/public/available/providerIds?brandId=${getBrandId()}`,
      method: 'OPTIONS',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      types: [
        FETCH_GAME_PROVIDERS.REQUEST,
        FETCH_GAME_PROVIDERS.SUCCESS,
        FETCH_GAME_PROVIDERS.FAILURE,
      ],
    },
  };
}

const initialState = {
  data: {
    withLines,
    type,
    gameProvider: [],
  },
  error: null,
  isLoading: false,
  receivedAt: null,
};
const actionTypes = {};
const actionCreators = {
  fetchGameProviders,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
