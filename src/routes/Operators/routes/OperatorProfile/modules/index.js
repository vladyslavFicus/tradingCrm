import { combineReducers } from 'redux';

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
  ...viewActionCreators,
  ...ipActionCreators,
};

const actionTypes = {
  ...viewActionTypes,
  ...ipActionTypes,
};

const initialState = {
  view: viewInitialState,
  ip: ipInitialState,
};

export {
  initialState,
  actionCreators,
  actionTypes,
};

export default combineReducers({
  view,
  ip,
});
