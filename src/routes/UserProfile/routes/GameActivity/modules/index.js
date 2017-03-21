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

const initialState = {
  activity: activityInitialState,
  games: gamesInitialState,
};
const actionTypes = {
  ...activityActionTypes,
  ...gamesActionTypes,
};
const actionCreators = {
  ...activityActionCreators,
  ...gamesActionCreators
};

export {
  initialState,
  actionTypes,
  actionCreators,
};

export default combineReducers({
  activity,
  games,
});
