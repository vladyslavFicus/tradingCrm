import { combineReducers } from 'redux';

import files, {
  initialState as filesInitialState,
  actionTypes as filesActionTypes,
  actionCreators as filesActionCreators,
} from './files';

const initialState = {
  files: filesInitialState,
};
const actionTypes = {
  ...filesActionTypes,
};
const actionCreators = {
  ...filesActionCreators,
  clearAll: () => (dispatch) => {
    dispatch(filesActionCreators.clearFiles());
  },
};

export {
  initialState,
  actionTypes,
  actionCreators,
};

export default combineReducers({
  files,
});
