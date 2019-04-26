import moment from 'moment';
import _ from 'lodash';
import fetch from '../../../../../utils/fetch';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import { actionCreators as profileActionCreators } from '../../../../../redux/modules/profile';
import { getApiRoot } from '../../../../../config';
import buildQueryString from '../../../../../utils/buildQueryString';
import downloadBlob from '../../../../../utils/downloadBlob';
import shallowEqual from '../../../../../utils/shallowEqual';
import { statuses } from '../../../../../constants/kyc';

const KEY = 'users';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-entities`);
const EXPORT_ENTITIES = createRequestAction(`${KEY}/export-entities`);
const RESET = `${KEY}/reset`;

const emptyBalance = {
  amount: 0,
  currency: 'EUR',
};

function mapProfile(item) {
  return {
    ...item,
    kycCompleted: item.kycPersonalStatus && item.kycPersonalStatus.status === statuses.VERIFIED
      && item.kycAddressStatus && item.kycAddressStatus.status === statuses.VERIFIED,
    age: moment().diff(item.birthDate, 'years'),
    signInIps: item.signInIps ? Object.values(item.signInIps).sort((a, b) => {
      if (a.sessionStart > b.sessionStart) {
        return -1;
      } else if (b.sessionStart > a.sessionStart) {
        return 1;
      }

      return 0;
    }) : item.signInIps,
    balance: item.realMoneyBalance || item.bonusBalance ? {
      amount: (
        (item.realMoneyBalance ? item.realMoneyBalance.amount : 0)
        + (item.bonusBalance ? item.bonusBalance.amount : 0)
      ),
      currency: item.currency || emptyBalance.currency,
    } : { ...emptyBalance, currency: item.currency || emptyBalance.currency },
  };
}

const fetchESEntities = profileActionCreators.fetchESEntities(FETCH_ENTITIES);

function reset() {
  return {
    type: RESET,
  };
}

function exportEntities(filters = {}) {
  return async (dispatch, getState) => {
    const { auth: { logged } } = getState();

    if (!logged) {
      return dispatch({ type: EXPORT_ENTITIES.FAILURE, error: true });
    }

    const queryString = buildQueryString(
      _.omitBy({ page: 0, ...filters }, val => !val)
    );

    try {
      const response = await fetch(`${getApiRoot()}/profile/profiles?${queryString}`, {
        method: 'GET',
        headers: {
          Accept: 'text/csv',
          'Content-Type': 'application/json',
        },
      });

      const blobData = await response.blob();
      downloadBlob(`users-export-${moment().format('YYYY-MM-DD-HH-mm-ss')}.csv`, blobData);

      return dispatch({ type: EXPORT_ENTITIES.SUCCESS });
    } catch (payload) {
      return dispatch({ type: EXPORT_ENTITIES.FAILURE, error: true, payload });
    }
  };
}

const initialState = {
  entities: {
    first: false,
    last: false,
    number: 0,
    numberOfElements: 0,
    size: 0,
    sort: null,
    totalElements: 0,
    totalPages: 0,
    content: [],
  },
  filters: {},
  isLoading: false,
  error: null,
  receivedAt: null,
  exporting: false,
  noResults: false,
};
const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: (state, action) => ({
    ...state,
    filters: { ...action.meta.filters },
    isLoading: true,
    error: null,
    exporting: state.exporting && shallowEqual(action.meta.filters, state.filters),
    noResults: false,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    entities: {
      ...state.entities,
      ...payload,
      content: payload.number === 0
        ? payload.content.map(mapProfile)
        : [
          ...state.entities.content,
          ...payload.content.map(mapProfile),
        ],
    },
    isLoading: false,
    receivedAt: endRequestTime,
    noResults: payload.content.length === 0,
  }),
  [FETCH_ENTITIES.FAILURE]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    isLoading: false,
    error: payload,
    receivedAt: endRequestTime,
  }),
  [EXPORT_ENTITIES.REQUEST]: state => ({
    ...state,
    exporting: true,
  }),
  [EXPORT_ENTITIES.SUCCESS]: state => ({
    ...state,
    exporting: false,
  }),
  [EXPORT_ENTITIES.FAILURE]: state => ({
    ...state,
    exporting: false,
  }),
  [RESET]: () => ({ ...initialState }),
};
const actionTypes = {
  FETCH_ENTITIES,
  EXPORT_ENTITIES,
  RESET,
};
const actionCreators = {
  fetchESEntities,
  exportEntities,
  reset,
};

export {
  actionCreators,
  actionTypes,
  initialState,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
