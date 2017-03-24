import { combineReducers } from 'redux';

import files, {
  initialState as filesInitialState,
  actionTypes as filesActionTypes,
  actionCreators as filesActionCreators,
} from './files';
import uploading, {
  initialState as uploadingInitialState,
  actionTypes as uploadingActionTypes,
  actionCreators as uploadingActionCreators,
} from './uploading';

const initialState = {
  files: filesInitialState,
  uploading: uploadingInitialState,
};
const actionTypes = {
  ...filesActionTypes,
  ...uploadingActionTypes,
};
const actionCreators = {
  ...filesActionCreators,
  ...uploadingActionCreators,
};

export {
  initialState,
  actionTypes,
  actionCreators,
};

export default combineReducers({
  files,
  uploading,
});
