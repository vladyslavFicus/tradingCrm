import { combineReducers } from 'redux';

import view, {
  actionCreators as viewActionCreators,
  actionTypes as viewActionTypes,
  initialState as viewInitialState,
} from './view';

import authorities, {
  actionCreators as authoritiesActionCreators,
  actionTypes as authoritiesActionTypes,
  initialState as authoritiesInitialState,
} from './authorities';

import forexOperator, {
  actionCreators as forexOperatorActionCreators,
  actionTypes as forexOperatorActionTypes,
  initialState as forexOperatorInitialState,
} from './forexOperator';

const actionCreators = {
  ...viewActionCreators,
  ...authoritiesActionCreators,
  ...forexOperatorActionCreators,
};

const actionTypes = {
  ...viewActionTypes,
  ...authoritiesActionTypes,
  ...forexOperatorActionTypes,
};

const initialState = {
  authorities: authoritiesInitialState,
  view: viewInitialState,
  forexOperator: forexOperatorInitialState,
};

export {
  initialState,
  actionCreators,
  actionTypes,
};

export default combineReducers({
  view,
  authorities,
  forexOperator,
});
