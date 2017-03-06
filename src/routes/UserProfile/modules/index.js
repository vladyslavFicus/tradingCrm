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

import view, {
  actionCreators as viewActionCreators,
  actionTypes as viewActionTypes,
  initialState as viewInitialState,
} from './view';

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

const actionCreators = {
  ...bonusActionCreators,
  ...viewActionCreators,
  ...ipActionCreators,
  ...accumulatedBalancesActionCreators,
  ...notesActionCreators,
};
const actionTypes = {
  ...bonusActionTypes,
  ...viewActionTypes,
  ...ipActionTypes,
  ...accumulatedBalancesActionTypes,
  ...notesActionTypes,
};
const initialState = {
  bonus: bonusInitialState,
  view: viewInitialState,
  ip: ipInitialState,
  accumulatedBalances: accumulatedBalancesInitialState,
  notes: notesInitialState,
};

export {
  actionTypes,
  actionCreators,
  initialState,
};
export default combineReducers({
  bonus,
  view,
  ip,
  accumulatedBalances,
  notes,
});
