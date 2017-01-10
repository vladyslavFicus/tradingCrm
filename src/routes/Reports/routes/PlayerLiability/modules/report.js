import { getApiRoot } from 'config/index';
import downloadBlob from 'utils/downloadBlob';
import { CALL_API } from 'redux-api-middleware';
import timestamp from 'utils/timestamp';
import buildQueryString from 'utils/buildQueryString';
import createRequestAction from 'utils/createRequestAction';

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
      .then((resp) => resp.blob())
      .then((blob) => downloadBlob(fileName, blob));
  };
}

const reducer = (state = initialState, action) => {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
};

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

export default reducer;
