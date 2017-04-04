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

import authorities, {
  actionCreators as authoritiesActionCreators,
  actionTypes as authoritiesActionTypes,
  initialState as authoritiesInitialState,
} from './authorities';

const actionCreators = {
  ...viewActionCreators,
  ...ipActionCreators,
  ...authoritiesActionCreators,
};

const actionTypes = {
  ...viewActionTypes,
  ...ipActionTypes,
  ...authoritiesActionTypes,
};

const initialState = {
  authorities: authoritiesInitialState,
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
  authorities,
});
