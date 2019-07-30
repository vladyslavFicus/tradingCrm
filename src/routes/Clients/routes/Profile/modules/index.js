import { combineReducers } from 'redux';

import files, {
  actionCreators as filesActionCreators,
  actionTypes as filesActionTypes,
  initialState as filesInitialState,
} from './files';

import profile, {
  actionCreators as profileActionCreators,
  actionTypes as profileActionTypes,
  initialState as profileInitialState,
} from './profile';

import uploading, {
  initialState as uploadingInitialState,
  actionTypes as uploadingActionTypes,
  actionCreators as uploadingActionCreators,
} from './uploading';

const actionCreators = {
  ...profileActionCreators,
  ...uploadingActionCreators,
  ...filesActionCreators,
};
const actionTypes = {
  ...profileActionTypes,
  ...uploadingActionTypes,
  ...filesActionTypes,
};
const initialState = {
  files: filesInitialState,
  profile: profileInitialState,
  uploading: uploadingInitialState,
};

export {
  actionTypes,
  actionCreators,
  initialState,
};
export default combineReducers({
  files,
  profile,
  uploading,
});
