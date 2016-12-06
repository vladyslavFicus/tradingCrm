import { createRequestTypes } from 'utils/redux';
import { getApiRoot } from 'config/index';
import buildQueryString from 'utils/buildQueryString';
import downloadBlob from 'utils/downloadBlob';

const KEY = 'revenue';
const FETCH_REPORT = createRequestTypes(`${KEY}/fetch-report`);
const LOADING_PROGRESS = `${KEY}/loading-progress`;

const initialState = {
  progress: null,
  error: null,
  isLoading: false,
};

const actionHandlers = {
  [LOADING_PROGRESS]: (state, action) => ({
    ...state,
    progress: action.payload,
    isLoading: state.isLoading && action.payload < 100,
  }),
  [FETCH_REPORT.REQUEST]: (state, action) => ({
    ...state,
    error: null,
    progress: 0,
    isLoading: true,
  }),
  [FETCH_REPORT.SUCCESS]: (state, action) => ({
    ...state,
    progress: null,
    isLoading: false,
  }),
  [FETCH_REPORT.FAILURE]: (state, action) => ({
    ...state,
    error: action.payload,
    progress: null,
    isLoading: false,
  }),
};

function fetchReport(params, fileName = 'revenue.csv') {
  return (dispatch, getState) => {
    const { token, uuid } = getState().auth;

    if (!token || !uuid) {
      return { type: false };
    }

    dispatch({ type: FETCH_REPORT.REQUEST });
    const url = `${getApiRoot()}/mga_report/reports/vat?${buildQueryString(params)}`;
    return fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/csv',
      },
    })
      .then(
        (resp) => ({ blob: resp.blob(), response: resp }),
        (err) => dispatch({ type: FETCH_REPORT.FAILURE, error: true, payload: err })
      )
      .then(
        ({ blob, response }) => {
          if (response.status === 200) {
            downloadBlob(fileName, blob);

            return dispatch({ type: FETCH_REPORT.SUCCESS });
          } else {
            return dispatch({
              type: FETCH_REPORT.FAILURE,
              error: true,
              payload: response.statusText,
            });
          }
        },

        (err) => dispatch({ type: FETCH_REPORT.FAILURE, error: true, payload: err })
      );
  };
}

const reducer = (state = initialState, action) => {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
};

const actionTypes = {
  LOADING_PROGRESS,
  FETCH_REPORT,
};
const actionCreators = {
  fetchReport,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default reducer;
