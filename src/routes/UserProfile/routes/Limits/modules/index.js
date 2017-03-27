import { combineReducers } from 'redux';

import notes, {
  actionCreators as notesActionCreators,
  actionTypes as notesActionTypes,
  initialState as notesInitialState,
} from './notes';

import view, {
  actionCreators as viewActionCreators,
  actionTypes as viewActionTypes,
  initialState as viewInitialState,
} from './view';

const actionCreators = {
  ...viewActionCreators,
  ...notesActionCreators,
};
const actionTypes = {
  ...viewActionTypes,
  ...notesActionTypes,
};
const initialState = {
  view: viewInitialState,
  notes: notesInitialState,
};

export {
  actionTypes,
  actionCreators,
  initialState,
};

export default combineReducers({
  view,
  notes,
});
