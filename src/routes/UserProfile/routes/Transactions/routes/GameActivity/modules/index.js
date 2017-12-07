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
import filters, {
  initialState as filtersInitialState,
  actionTypes as filtersActionTypes,
  actionCreators as filtersActionCreators,
} from './filters';

const initialState = {
  activity: activityInitialState,
  filters: filtersInitialState,
  games: gamesInitialState,
};
const actionTypes = {
  ...activityActionTypes,
  ...filtersActionTypes,
  ...gamesActionTypes,
};
const actionCreators = {
  ...activityActionCreators,
  ...filtersActionCreators,
  ...gamesActionCreators,
};

export {
  initialState,
  actionTypes,
  actionCreators,
};

export default combineReducers({
  activity,
  filters,
  games,
});
