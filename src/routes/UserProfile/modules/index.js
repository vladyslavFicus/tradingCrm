import { combineReducers } from 'redux';

import bonus, {
  actionCreators as bonusActionCreators,
  actionTypes as bonusActionTypes,
  initialState as bonusInitialState,
} from './bonus';

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
};
const actionTypes = {
  ...bonusActionTypes,
  ...viewActionTypes,
  ...ipActionTypes,
  ...accumulatedBalancesActionTypes,
};
export {
  actionTypes,
  actionCreators,
};
const initialState = {
  bonus: bonusInitialState,
  view: viewInitialState,
  ip: ipInitialState,
  accumulatedBalances: accumulatedBalancesInitialState,
};
export default (state = initialState, action) => {
  const reducer = combineReducers({
    bonus,
    view,
    ip,
    accumulatedBalances,
  });

  return reducer(state, action);
};
