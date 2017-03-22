import { combineReducers } from 'redux';

import activity, {
  initialState as activityInitialState,
  actionTypes as activityActionTypes,
  actionCreators as activityActionCreators,
} from './activity';
import games, {
  initialState as gamesInitialState,
  actionTypes as gamesActionTypes,
  actionCreators as gamesActionCreators,
} from './games';
import gameCategories, {
  initialState as gameCategoriesInitialState,
  actionTypes as gameCategoriesActionTypes,
  actionCreators as gameCategoriesActionCreators,
} from './gameCategories';

const initialState = {
  activity: activityInitialState,
  games: gamesInitialState,
  gameCategories: gameCategoriesInitialState,
};
const actionTypes = {
  ...activityActionTypes,
  ...gamesActionTypes,
  ...gameCategoriesActionTypes,
};
const actionCreators = {
  ...activityActionCreators,
  ...gamesActionCreators,
  ...gameCategoriesActionCreators,
};

export {
  initialState,
  actionTypes,
  actionCreators,
};

export default combineReducers({
  activity,
  games,
  gameCategories,
});
