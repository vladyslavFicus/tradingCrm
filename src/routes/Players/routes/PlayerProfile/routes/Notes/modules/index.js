import { combineReducers } from 'redux';

import noteTypes, {
  actionCreators as noteTypesActionCreators,
  actionTypes as noteTypesActionTypes,
  initialState as noteTypesInitialState,
} from './noteTypes';

const actionCreators = {
  ...noteTypesActionCreators,
};
const actionTypes = {
  ...noteTypesActionTypes,
};
const initialState = {
  noteTypes: noteTypesInitialState,
};

export {
  actionTypes,
  actionCreators,
  initialState,
};

export default combineReducers({
  noteTypes,
});
