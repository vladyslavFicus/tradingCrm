import createRequestAction from '../../../../../utils/createRequestAction';
import { sourceActionCreators } from '../../../../../redux/modules/campaigns/freeSpinTemplates/options';
import createReducer from '../../../../../utils/createReducer';

const KEY = 'bonus-campaign/create/options';
const FETCH_GAME_AGGREGATORS = createRequestAction(`${KEY}/fetch-game-aggregators`);

const fetchGameAggregators = sourceActionCreators.fetchGameAggregators(FETCH_GAME_AGGREGATORS);

const initialState = {
  data: {
    igromat: ['novomatic', 'igrosoft'],
    softgamings: ['betsoft', 'amaticdirect', 'habanero', 'netent'],
  },
  error: null,
  isLoading: false,
  receivedAt: null,
};

const actionHandlers = {
  [FETCH_GAME_AGGREGATORS.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_GAME_AGGREGATORS.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    data: payload,
    isLoading: false,
    receivedAt: endRequestTime,
  }),
  [FETCH_GAME_AGGREGATORS.FAILURE]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    isLoading: false,
    error: payload,
    receivedAt: endRequestTime,
  }),
};

const actionTypes = {
  FETCH_GAME_AGGREGATORS,
};

const actionCreators = {
  fetchGameAggregators,
};

export {
  initialState,
  actionHandlers,
  actionTypes,
  actionCreators,
};

export default createReducer(initialState, actionHandlers);
