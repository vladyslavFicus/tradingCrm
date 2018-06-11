import { combineReducers } from 'redux';

import {
  actionCreators as campaignsActionCreators,
  actionTypes as campaignsActionTypes,
} from './campaigns';
import list, {
  actionCreators as listActionCreators,
  actionTypes as listActionTypes,
  initialState as listInitialState,
} from './list';

const actionCreators = {
  ...campaignsActionCreators,
  ...listActionCreators,
};
const actionTypes = {
  ...campaignsActionTypes,
  ...listActionTypes,
};
const initialState = {
  list: listInitialState,
};

export {
  actionCreators,
  actionTypes,
  initialState,
};
export default combineReducers({
  list,
});
