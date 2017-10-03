import { combineReducers } from 'redux';

import files, {
  initialState as filesInitialState,
  actionTypes as filesActionTypes,
  actionCreators as filesActionCreators,
} from './files';

import games, {
  initialState as gamesInitialState,
  actionTypes as gamesActionTypes,
  actionCreators as gamesActionCreators,
} from './games';

const initialState = {
  files: filesInitialState,
  games: gamesInitialState,
};
const actionTypes = {
  ...filesActionTypes,
  ...gamesActionTypes,
};
const actionCreators = {
  ...gamesActionCreators,
  ...filesActionCreators,
  clearAll: () => (dispatch) => {
    dispatch(filesActionCreators.clearFiles());
    dispatch(gamesActionCreators.resetGames());
  },
};

export {
  initialState,
  actionTypes,
  actionCreators,
};

export default combineReducers({
  files,
  games,
});
