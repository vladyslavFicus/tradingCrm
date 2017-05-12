import { combineReducers } from 'redux';

import bonus, {
  actionCreators as bonusActionCreators,
  actionTypes as bonusActionTypes,
  initialState as bonusInitialState,
} from './bonus';

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

import ip, {
  actionCreators as ipActionCreators,
  actionTypes as ipActionTypes,
  initialState as ipInitialState,
} from './ip';

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
  ...bonusActionCreators,
  ...profileActionCreators,
  ...ipActionCreators,
  ...accumulatedBalancesActionCreators,
  ...notesActionCreators,
  ...walletLimitsActionCreators,
  ...uploadingActionCreators,
};
const actionTypes = {
  ...bonusActionTypes,
  ...profileActionTypes,
  ...ipActionTypes,
  ...accumulatedBalancesActionTypes,
  ...notesActionTypes,
  ...walletLimitsActionTypes,
  ...uploadingActionTypes,
};
const initialState = {
  bonus: bonusInitialState,
  view: profileInitialState,
  ip: ipInitialState,
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
  bonus,
  profile,
  ip,
  accumulatedBalances,
  notes,
  walletLimits,
  uploading,
});
