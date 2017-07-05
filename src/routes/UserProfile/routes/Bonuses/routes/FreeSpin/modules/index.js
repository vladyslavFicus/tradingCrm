import { combineReducers } from 'redux';

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
  ...filtersActionCreators,
  ...listActionCreators,
  resetAll: () => (dispatch) => {
    dispatch(listActionCreators.resetList());
  },
};
const actionTypes = {
  ...filtersActionTypes,
  ...listActionTypes,
};
const initialState = {
  ...filtersInitialState,
  ...listInitialState,
};

export {
  actionCreators,
  actionTypes,
  initialState,
};
export default combineReducers({
  filters,
  list,
});
