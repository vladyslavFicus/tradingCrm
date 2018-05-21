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
import templates, {
  initialState as templatesInitialState,
  actionTypes as templatesActionTypes,
  actionCreators as templatesActionCreators,
} from './templates';

const actionCreators = {
  ...gamesActionCreators,
  ...filtersActionCreators,
  ...listActionCreators,
  ...templatesActionCreators,
  resetAll: () => (dispatch) => {
    dispatch(listActionCreators.resetList());
  },
};
const actionTypes = {
  ...gamesActionTypes,
  ...filtersActionTypes,
  ...listActionTypes,
  ...templatesActionTypes,
};
const initialState = {
  ...gamesInitialState,
  ...filtersInitialState,
  ...listInitialState,
  ...templatesInitialState,
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
  templates,
});
