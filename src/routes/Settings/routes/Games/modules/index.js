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

import filters, {
  initialState as filtersInitialState,
  actionTypes as filtersActionTypes,
  actionCreators as filtersActionCreators,
} from './filters';

import options, {
  initialState as optionsInitialState,
  actionTypes as optionsActionTypes,
  actionCreators as optionsActionCreators,
} from './options';

const initialState = {
  files: filesInitialState,
  games: gamesInitialState,
  filters: filtersInitialState,
  options: optionsInitialState,
};
const actionTypes = {
  ...filesActionTypes,
  ...gamesActionTypes,
  ...filtersActionTypes,
  ...optionsActionTypes,
};
const actionCreators = {
  ...gamesActionCreators,
  ...filesActionCreators,
  ...filtersActionCreators,
  ...optionsActionCreators,
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
  options,
  games,
  filters,
});
