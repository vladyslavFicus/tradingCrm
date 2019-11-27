import { combineReducers } from 'redux';

import files, {
  actionCreators as filesActionCreators,
  actionTypes as filesActionTypes,
  initialState as filesInitialState,
} from './files';

import uploading, {
  initialState as uploadingInitialState,
  actionTypes as uploadingActionTypes,
  actionCreators as uploadingActionCreators,
} from './uploading';

const actionCreators = {
  ...uploadingActionCreators,
  ...filesActionCreators,
};
const actionTypes = {
  ...uploadingActionTypes,
  ...filesActionTypes,
};
const initialState = {
  files: filesInitialState,
  uploading: uploadingInitialState,
};

export {
  actionTypes,
  actionCreators,
  initialState,
};
export default combineReducers({
  files,
  uploading,
});
