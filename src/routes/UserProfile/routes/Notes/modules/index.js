import { combineReducers } from 'redux';

import view, {
  actionCreators as viewActionCreators,
  actionTypes as viewActionTypes,
  initialState as viewInitialState,
} from './view';

import noteTypes, {
  actionCreators as noteTypesActionCreators,
  actionTypes as noteTypesActionTypes,
  initialState as noteTypesInitialState,
} from './noteTypes';

const actionCreators = {
  ...viewActionCreators,
  ...noteTypesActionCreators,
};
const actionTypes = {
  ...viewActionTypes,
  ...noteTypesActionTypes,
};
const initialState = {
  view: viewInitialState,
  noteTypes: noteTypesInitialState,
};

export {
  actionTypes,
  actionCreators,
  initialState,
};

export default combineReducers({
  view,
  noteTypes,
});
