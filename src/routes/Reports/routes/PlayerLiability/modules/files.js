import { getApiRoot } from 'config/index';
import downloadBlob from 'utils/downloadBlob';
import { CALL_API } from 'redux-api-middleware';
import timestamp from 'utils/timestamp';
import buildQueryString from 'utils/buildQueryString';
import createRequestAction from 'utils/createRequestAction';

const KEY = 'reports/player-liability/files';
const FETCH_REPORT_FILES = createRequestAction(`${KEY}/fetch-report-files`);

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
  [FETCH_REPORT_FILES.REQUEST]: (state, action) => ({
    ...state,
    filters: { ...action.meta.filters },
    isLoading: true,
    error: null,
  }),
  [FETCH_REPORT_FILES.SUCCESS]: (state, action) => ({
    ...state,
    entities: {
      ...state.entities,
      ...action.payload,
    },
    isLoading: false,
    receivedAt: timestamp(),
  }),
  [FETCH_REPORT_FILES.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),
};

function fetchReportFiles(filters = {}) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `mga_report/reports/player-liability/files?${buildQueryString(filters)}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          {
            type: FETCH_REPORT_FILES.REQUEST,
            meta: { filters },
          },
          FETCH_REPORT_FILES.SUCCESS,
          FETCH_REPORT_FILES.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function downloadReportFile(file) {
  return (dispatch, getState) => {
    const { token } = getState().auth;

    return fetch(`${getApiRoot()}/mga_report/reports/player-liability/files/${file}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/csv',
      },
    })
      .then((resp) => resp.blob())
      .then((blob) => downloadBlob(file, blob));
  };
}

const reducer = (state = initialState, action) => {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
};

const actionTypes = {
  FETCH_REPORT_FILES,
};
const actionCreators = {
  fetchReportFiles,
  downloadReportFile,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default reducer;
