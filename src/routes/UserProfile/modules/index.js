import { combineReducers } from 'redux';

import notes, {
  actionCreators as notesActionCreators,
  actionTypes as notesActionTypes,
  initialState as notesInitialState,
} from './notes';

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
};
const actionTypes = {
  ...profileActionTypes,
  ...accumulatedBalancesActionTypes,
  ...notesActionTypes,
  ...walletLimitsActionTypes,
  ...uploadingActionTypes,
};
const initialState = {
  view: profileInitialState,
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
  profile,
  accumulatedBalances,
  notes,
  walletLimits,
  uploading,
});
