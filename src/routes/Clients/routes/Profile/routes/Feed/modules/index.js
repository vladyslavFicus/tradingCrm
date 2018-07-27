import { combineReducers } from 'redux';

import feed, {
  initialState as feedInitialState,
  actionTypes as feedActionTypes,
  actionCreators as feedActionCreators,
} from './feed';
import feedTypes, {
  initialState as feedTypesInitialState,
  actionTypes as feedTypesActionTypes,
  actionCreators as feedTypesActionCreators,
} from './feedTypes';

const initialState = {
  feed: feedInitialState,
  feedTypes: feedTypesInitialState,
};
const actionTypes = {
  ...feedActionTypes,
  ...feedTypesActionTypes,
};
const actionCreators = {
  ...feedActionCreators,
  ...feedTypesActionCreators,
};

export {
  initialState,
  actionTypes,
  actionCreators,
};

export default combineReducers({
  feed,
  feedTypes,
});
