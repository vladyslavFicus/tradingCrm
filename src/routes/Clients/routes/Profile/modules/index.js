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

import playerLimits, {
  actionCreators as playerLimitsActionCreators,
  actionTypes as playerLimitsActionTypes,
  initialState as playerLimitsInitialState,
} from './playerLimits';


import uploading, {
  initialState as uploadingInitialState,
  actionTypes as uploadingActionTypes,
  actionCreators as uploadingActionCreators,
} from './uploading';

const actionCreators = {
  ...profileActionCreators,
  ...notesActionCreators,
  ...playerLimitsActionCreators,
  ...uploadingActionCreators,
  ...filesActionCreators,
};
const actionTypes = {
  ...profileActionTypes,
  ...notesActionTypes,
  ...playerLimitsActionTypes,
  ...uploadingActionTypes,
  ...filesActionTypes,
};
const initialState = {
  files: filesInitialState,
  profile: profileInitialState,
  notes: notesInitialState,
  playerLimits: playerLimitsInitialState,
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
  playerLimits,
  uploading,
});
