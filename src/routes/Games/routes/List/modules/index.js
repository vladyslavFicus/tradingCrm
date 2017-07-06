import { combineReducers } from 'redux';
import { CALL_API } from 'redux-api-middleware';
import createRequestAction from '../../../../../utils/createRequestAction';

import files, {
  initialState as filesInitialState,
  actionTypes as filesActionTypes,
  actionCreators as filesActionCreators,
} from './files';

const KEY = 'games/list/files';
const RESET_GAMES = createRequestAction(`${KEY}/reset-games`);

const initialState = {
  files: filesInitialState,
};
const actionTypes = {
  ...filesActionTypes,
  RESET_GAMES,
};
const actionCreators = {
  ...filesActionCreators,
  clearAll: () => (dispatch) => {
    dispatch(filesActionCreators.clearFiles());
  },
  resetGames: () => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: 'game_info/games/reset',
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          RESET_GAMES.REQUEST,
          RESET_GAMES.SUCCESS,
          RESET_GAMES.FAILURE,
        ],
        bailout: !logged,
      },
    });
  },
};

export {
  initialState,
  actionTypes,
  actionCreators,
};

export default combineReducers({
  files,
});
