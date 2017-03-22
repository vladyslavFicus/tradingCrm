import { combineReducers } from 'redux';

import view, {
  initialState as viewInitialState,
  actionTypes as viewActionTypes,
  actionCreators as viewActionCreators,
} from './view';

const initialState = {
  view: viewInitialState,
};
const actionTypes = {
  ...viewActionTypes,
};
const actionCreators = {
  ...viewActionCreators,
};

export {
  initialState,
  actionTypes,
  actionCreators,
};

export default combineReducers({
  view,
});
