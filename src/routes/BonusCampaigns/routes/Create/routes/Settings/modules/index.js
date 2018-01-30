import { combineReducers } from 'redux';

import games, {
  actionCreators as gamesActionCreators,
  actionTypes as gamesActionTypes,
  initialState as gamesInitialState,
} from './games';

import templates, {
  actionCreators as templatesActionCreators,
  actionTypes as templatesActionTypes,
  initialState as templatesInitialState,
} from './templates';

const actionCreators = {
  ...gamesActionCreators,
  ...templatesActionCreators,
};

const actionTypes = {
  ...gamesActionTypes,
  ...templatesActionTypes,
};

const initialState = {
  games: gamesInitialState,
  templates: templatesInitialState,
};

export {
  actionTypes,
  actionCreators,
  initialState,
};

export default combineReducers({
  games,
  templates,
});

