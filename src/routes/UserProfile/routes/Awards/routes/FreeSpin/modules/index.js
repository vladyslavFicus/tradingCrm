import { combineReducers } from 'redux';

import games, {
  initialState as gamesInitialState,
  actionTypes as gamesActionTypes,
  actionCreators as gamesActionCreators,
} from './games';
import list, {
  actionCreators as listActionCreators,
  actionTypes as listActionTypes,
  initialState as listInitialState,
} from './list';
import filters, {
  initialState as filtersInitialState,
  actionTypes as filtersActionTypes,
  actionCreators as filtersActionCreators,
} from './filters';

const actionCreators = {
  ...gamesActionCreators,
  ...filtersActionCreators,
  ...listActionCreators,
  resetAll: () => (dispatch) => {
    dispatch(listActionCreators.resetList());
  },
};
const actionTypes = {
  ...gamesActionTypes,
  ...filtersActionTypes,
  ...listActionTypes,
};
const initialState = {
  ...gamesInitialState,
  ...filtersInitialState,
  ...listInitialState,
};

export {
  actionCreators,
  actionTypes,
  initialState,
};
export default combineReducers({
  games,
  filters,
  list,
});
