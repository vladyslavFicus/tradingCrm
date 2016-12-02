import { createRequestTypes } from 'utils/redux';
import { getApiRoot } from 'config/index';

const KEY = 'reports/player-liability';
const FETCH_REPORT = createRequestTypes(`${KEY}/fetch-report`);

const initialState = {};
const actionHandlers = {};

function download(name, data) {
  const a = document.createElement('a');
  a.href = window.URL.createObjectURL(data);
  a.download = name;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
}

function fetchReport(fileName = 'player-liability.csv') {
  return (dispatch, getState) => {
    const { token, uuid } = getState().auth;

    if (!token || !uuid) {
      return { type: false };
    }

    return fetch(`${getApiRoot()}/mga_report/reports/player-liability`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/csv',
      }
    })
      .then((resp) => resp.blob())
      .then((blob) => download(fileName, blob));
  };
}

const reducer = (state = initialState, action) => {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
};

const actionTypes = { FETCH_REPORT };
const actionCreators = { fetchReport };

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default reducer;
