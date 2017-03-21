import { combineReducers } from 'redux';
import files, {
  initialState as filesInitialState,
  actionCreators as filesActionCreators,
  actionTypes as filesActionTypes
} from './files';
import view, {
  initialState as viewInitialState,
  actionCreators as viewActionCreators,
  actionTypes as viewActionTypes
} from './view';

const actionTypes = {
  ...filesActionTypes,
  ...viewActionTypes,
};
const actionCreators = {
  ...filesActionCreators,
  ...viewActionCreators,
};
const initialState = {
  view: viewInitialState,
  files: filesInitialState,
};

export {
  initialState,
  actionTypes,
  actionCreators,
};

export default combineReducers({
  view,
  files,
});
