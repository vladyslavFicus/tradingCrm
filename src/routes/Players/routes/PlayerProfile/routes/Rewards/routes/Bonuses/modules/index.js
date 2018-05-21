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
import templates, {
  initialState as templatesInitialState,
  actionTypes as templatesActionTypes,
  actionCreators as templatesActionCreators,
} from './templates';

const actionCreators = {
  ...listActionCreators,
  ...bonusActionCreators,
  ...templatesActionCreators,
};
const actionTypes = {
  ...listActionTypes,
  ...bonusActionTypes,
  ...templatesActionTypes,
};
const initialState = {
  ...listInitialState,
  ...bonusInitialState,
  ...templatesInitialState,
};

export {
  actionCreators,
  actionTypes,
  initialState,
};
export default combineReducers({
  list,
  bonus,
  templates,
});
