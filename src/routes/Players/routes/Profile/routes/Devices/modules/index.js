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
  ...listActionCreators,
  ...filtersActionCreators,
};
const actionTypes = {
  ...listActionTypes,
  ...filtersActionTypes,
};
const initialState = {
  list: listInitialState,
  filters: filtersInitialState,
};

export {
  actionTypes,
  actionCreators,
  initialState,
};

export default combineReducers({
  list,
  filters,
});
