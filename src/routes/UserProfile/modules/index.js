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

import walletLimits, {
  actionCreators as walletLimitsActionCreators,
  actionTypes as walletLimitsActionTypes,
  initialState as walletLimitsInitialState,
} from './wallet-limits';

import uploading, {
  initialState as uploadingInitialState,
  actionTypes as uploadingActionTypes,
  actionCreators as uploadingActionCreators,
} from './uploading';

const actionCreators = {
  ...profileActionCreators,
  ...accumulatedBalancesActionCreators,
  ...notesActionCreators,
  ...walletLimitsActionCreators,
  ...uploadingActionCreators,
  ...filesActionCreators,
};
const actionTypes = {
  ...profileActionTypes,
  ...accumulatedBalancesActionTypes,
  ...notesActionTypes,
  ...walletLimitsActionTypes,
  ...uploadingActionTypes,
  ...filesActionTypes,
};
const initialState = {
  files: filesInitialState,
  profile: profileInitialState,
  accumulatedBalances: accumulatedBalancesInitialState,
  notes: notesInitialState,
  walletLimits: walletLimitsInitialState,
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
  accumulatedBalances,
  notes,
  walletLimits,
  uploading,
});
