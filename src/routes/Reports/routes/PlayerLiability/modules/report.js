import { CALL_API } from 'redux-api-middleware';
import fetch from '../../../../../utils/fetch';
import createReducer from '../../../../../utils/createReducer';
import { getApiRoot } from '../../../../../config';
import downloadBlob from '../../../../../utils/downloadBlob';
import buildQueryString from '../../../../../utils/buildQueryString';
import createRequestAction from '../../../../../utils/createRequestAction';

const KEY = 'reports/player-liability/report';
const FETCH_REPORT = createRequestAction(`${KEY}/fetch-report`);

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
  error: null,
  isLoading: false,
  receivedAt: null,
};
const actionHandlers = {
  [FETCH_REPORT.REQUEST]: (state, action) => ({
    ...state,
    filters: { ...action.meta.filters },
    isLoading: true,
    error: null,
  }),
  [FETCH_REPORT.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    entities: {
      ...state.entities,
      ...payload,
    },
    isLoading: false,
    receivedAt: endRequestTime,
  }),
  [FETCH_REPORT.FAILURE]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    isLoading: false,
    error: payload,
    receivedAt: endRequestTime,
  }),
};

function fetchReport(filters = {}) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `mga_report/reports/player-liability?${buildQueryString(filters)}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          {
            type: FETCH_REPORT.REQUEST,
            meta: { filters },
          },
          FETCH_REPORT.SUCCESS,
          FETCH_REPORT.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function downloadReport(fileName = 'player-liability.csv') {
  return (dispatch, getState) => {
    const { token } = getState().auth;

    return fetch(`${getApiRoot()}/mga_report/reports/player-liability`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/csv',
      },
    })
      .then(resp => resp.blob())
      .then(blob => downloadBlob(fileName, blob));
  };
}

const actionTypes = {
  FETCH_REPORT,
};
const actionCreators = {
  downloadReport,
  fetchReport,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
