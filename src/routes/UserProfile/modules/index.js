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

import accumulatedBalances, {
  actionCreators as accumulatedBalancesActionCreators,
  actionTypes as accumulatedBalancesActionTypes,
  initialState as accumulatedBalancesInitialState,
} from './accumulatedBalances';

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

import meta, {
  initialState as metaInitialState,
  actionTypes as metaActionTypes,
  actionCreators as metaActionCreators,
} from './meta';

const actionCreators = {
  ...profileActionCreators,
  ...accumulatedBalancesActionCreators,
  ...notesActionCreators,
  ...playerLimitsActionCreators,
  ...uploadingActionCreators,
  ...filesActionCreators,
  ...metaActionCreators,
};
const actionTypes = {
  ...profileActionTypes,
  ...accumulatedBalancesActionTypes,
  ...notesActionTypes,
  ...playerLimitsActionTypes,
  ...uploadingActionTypes,
  ...filesActionTypes,
  ...metaActionTypes,
};
const initialState = {
  files: filesInitialState,
  profile: profileInitialState,
  accumulatedBalances: accumulatedBalancesInitialState,
  notes: notesInitialState,
  playerLimits: playerLimitsInitialState,
  uploading: uploadingInitialState,
  meta: metaInitialState,
};

export {
  actionTypes,
  actionCreators,
  initialState,
};
export default combineReducers({
  files,
  profile,
  accumulatedBalances,
  notes,
  playerLimits,
  uploading,
  meta,
});
