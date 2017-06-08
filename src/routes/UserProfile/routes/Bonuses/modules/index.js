import { combineReducers } from 'redux';

import bonus, {
  actionCreators as bonusActionCreators,
  actionTypes as bonusActionTypes,
  initialState as bonusInitialState,
} from './bonus';
import list, {
  actionCreators as listActionCreators,
  actionTypes as listActionTypes,
  initialState as listInitialState,
} from './list';

const actionCreators = {
  ...listActionCreators,
  ...bonusActionCreators,
};
const actionTypes = {
  ...listActionTypes,
  ...bonusActionTypes,
};
const initialState = {
  ...listInitialState,
  ...bonusInitialState,
};

export {
  actionCreators,
  actionTypes,
  initialState,
};
export default combineReducers({
  list,
  bonus,
});
