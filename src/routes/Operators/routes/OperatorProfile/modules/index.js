import { combineReducers } from 'redux';

import view, {
  actionCreators as viewActionCreators,
  actionTypes as viewActionTypes,
  initialState as viewInitialState,
} from './view';

const actionCreators = {
  ...viewActionCreators,
};

const actionTypes = {
  ...viewActionTypes,
};

const initialState = {
  view: viewInitialState,
};

export {
  initialState,
  actionCreators,
  actionTypes,
};

export default combineReducers({
  view,
});
