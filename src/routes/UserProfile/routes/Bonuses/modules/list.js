import { CALL_API } from 'redux-api-middleware';
import createRequestAction from 'utils/createRequestAction';
import timestamp from 'utils/timestamp';
import buildQueryString from 'utils/buildQueryString';

const KEY = 'bonuses';
const FETCH_ENTITIES = createRequestAction(`${KEY}/entities`);

function fetchEntities(filters = {}) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    if (!filters.playerUUID) {
      throw new Error('playerUUID not defined');
    }

    const playerUUID = filters.playerUUID;
    delete filters.playerUUID;

    return dispatch({
      [CALL_API]: {
        endpoint: `bonus/bonuses/${playerUUID}?${buildQueryString(filters)}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          {
            type: FETCH_ENTITIES.REQUEST,
            meta: { filters },
          },
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
    filters: { ...action.filters },
    isLoading: true,
    error: null,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, action) => ({
    ...state,
    entities: {
      ...state.entities,
      ...action.payload,
      content: action.payload.content.map(item => {
        if (item.wagered === null) {
          item.wagered = { amount: 0, currency: item.currency };
        }

        item.toWager = {
          amount: Math.max(
            item.amountToWage && !isNaN(item.amountToWage.amount) &&
            item.wagered && !isNaN(item.wagered.amount)
              ? item.amountToWage.amount - item.wagered.amount : 0,
            0
          ),
          currency: item.currency,
        };

        return item;
      }),
    },
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
};

const actionCreators = {
  fetchEntities,
};

export {
  actionTypes,
  actionCreators,
};

export default reducer;
