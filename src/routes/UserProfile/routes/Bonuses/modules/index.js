import { combineReducers } from 'redux';
import list, {
  actionCreators as listActionCreators,
  actionTypes as listActionTypes,
  initialState as listInitialState,
} from './list';

const actionCreators = {
  ...listActionCreators,
};
const actionTypes = {
  ...listActionTypes,
};
const initialState = {
  ...listInitialState,
};

export {
  actionCreators,
  actionTypes,
  initialState,
};
export default combineReducers({
  list,
});
