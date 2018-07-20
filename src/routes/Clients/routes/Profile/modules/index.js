import { combineReducers } from 'redux';

import notes, {
  actionCreators as notesActionCreators,
  actionTypes as notesActionTypes,
  initialState as notesInitialState,
} from './notes';

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
  ...notesActionCreators,
  ...uploadingActionCreators,
  ...filesActionCreators,
};
const actionTypes = {
  ...profileActionTypes,
  ...notesActionTypes,
  ...uploadingActionTypes,
  ...filesActionTypes,
};
const initialState = {
  files: filesInitialState,
  profile: profileInitialState,
  notes: notesInitialState,
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
  notes,
  uploading,
});
