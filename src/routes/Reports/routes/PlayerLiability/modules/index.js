import { combineReducers } from 'redux';

import files, {
  actionCreators as filesActionCreators,
  actionTypes as filesActionTypes,
  initialState as filesInitialState,
} from './files';
import report, {
  actionCreators as reportActionCreators,
  actionTypes as reportActionTypes,
  initialState as reportInitialState,
} from './report';

const initialState = {
  files: filesInitialState,
  report: reportInitialState,
};
const actionTypes = {
  ...filesActionTypes,
  ...reportActionTypes,
};
const actionCreators = {
  ...filesActionCreators,
  ...reportActionCreators,
};

export {
  actionCreators,
  actionTypes,
  initialState,
};

export default combineReducers({
  files,
  report,
});
