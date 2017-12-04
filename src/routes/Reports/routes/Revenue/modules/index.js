import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../utils/createReducer';
import { getApiRoot } from '../../../../../config';
import buildQueryString from '../../../../../utils/buildQueryString';
import createRequestAction from '../../../../../utils/createRequestAction';
import downloadBlob from '../../../../../utils/downloadBlob';
import timestamp from '../../../../../utils/timestamp';

const KEY = 'reports/revenue';
const DOWNLOAD_REPORT = createRequestAction(`${KEY}/download-report`);
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
    totalsRow: [],
    content: [],
  },
  filters: {},
  error: null,
  isLoading: false,
};
const actionHandlers = {
  [DOWNLOAD_REPORT.REQUEST]: state => ({
    ...state,
    error: null,
    isLoading: true,
  }),
  [DOWNLOAD_REPORT.SUCCESS]: state => ({
    ...state,
    isLoading: false,
  }),
  [DOWNLOAD_REPORT.FAILURE]: (state, action) => ({
    ...state,
    error: action.payload,
    isLoading: false,
  }),

  [FETCH_REPORT.REQUEST]: (state, action) => ({
    ...state,
    filters: { ...action.meta.filters },
    isLoading: true,
    error: null,
  }),
  [FETCH_REPORT.SUCCESS]: (state, action) => ({
    ...state,
    entities: {
      ...state.entities,
      ...action.payload,
    },
    isLoading: false,
    receivedAt: timestamp(),
  }),
  [FETCH_REPORT.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),
};

function fetchReport(filters = {}) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `mga_report/reports/vat?${buildQueryString(filters)}`,
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

function downloadReport(filters, fileName = 'revenue.csv') {
  return (dispatch, getState) => {
    const { token, uuid } = getState().auth;

    if (!token || !uuid || Object.keys(filters).length === 0) {
      return null;
    }

    dispatch({ type: DOWNLOAD_REPORT.REQUEST });
    const url = `${getApiRoot()}/mga_report/reports/vat?${buildQueryString(filters)}`;
    return fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/csv',
      },
    })
      .then(
        (resp) => {
          if (resp.status !== 200) {
            throw new Error(resp.statusText);
          }

          return resp.blob();
        },

        (err) => dispatch({ type: DOWNLOAD_REPORT.FAILURE, error: true, payload: err })
      )
      .then(
        (blob) => {
          downloadBlob(fileName, blob);

          return dispatch({ type: DOWNLOAD_REPORT.SUCCESS });
        },

        (err) => dispatch({ type: DOWNLOAD_REPORT.FAILURE, error: true, payload: err })
      );
  };
}

const actionTypes = {
  FETCH_REPORT,
  DOWNLOAD_REPORT,
};
const actionCreators = {
  fetchReport,
  downloadReport,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
