import { WEB_API } from 'constants/index';
import { getTimestamp } from 'utils/helpers';
import { createRequestTypes } from 'utils/redux';
import { actionCreators as usersActionCreators, initialState } from '../../../../Users/modules/list';

const KEY = 'users';
const FETCH_ENTITIES = createRequestTypes(`${KEY}/entities`);

function fetchEntities(filters = {}) {
  return usersActionCreators.fetchEntities({
    page: 0,
    state: 'IN_REVIEW',
    limit: 10,
    ...filters,
  });
}

const handlers = {
  [FETCH_ENTITIES.REQUEST]: (state, action) => ({
    ...state,
    filters: { ...state.filters, ...action.filters },
    isLoading: true,
    isFailed: false,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, action) => ({
    ...state,
    entities: { ...action.response, },
    isLoading: false,
    receivedAt: getTimestamp(),
  }),
  [FETCH_ENTITIES.FAILURE]: (state, action) => ({
    ...state, isLoading: false,
    isFailed: true,
    receivedAt: getTimestamp(),
  }),
};

function reducer(state = initialState, action) {
  const handler = handlers[action.type];

  return handler ? handler(state, action) : state;
}

const actionCreators = {
  fetchEntities,
};

export { actionCreators, };

export default reducer;
