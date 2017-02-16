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

const actionCreators = {
  ...bonusActionCreators,
  ...viewActionCreators,
  ...ipActionCreators,
};
const actionTypes = {
  ...bonusActionTypes,
  ...viewActionTypes,
  ...ipActionTypes,
};
export {
  actionTypes,
  actionCreators,
};
const initialState = {
  bonus: bonusInitialState,
  view: viewInitialState,
  ip: ipInitialState,
};
export default (state = initialState, action) => {
  const reducer = combineReducers({
    bonus,
    view,
    ip,
  });

  return reducer(state, action);
};
