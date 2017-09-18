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

const actionCreators = {
  ...viewActionCreators,
  ...authoritiesActionCreators,
};

const actionTypes = {
  ...viewActionTypes,
  ...authoritiesActionTypes,
};

const initialState = {
  authorities: authoritiesInitialState,
  view: viewInitialState,
};

export {
  initialState,
  actionCreators,
  actionTypes,
};

export default combineReducers({
  view,
  authorities,
});
