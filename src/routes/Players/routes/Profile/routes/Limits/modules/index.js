import { combineReducers } from 'redux';

import view, {
  actionCreators as viewActionCreators,
  actionTypes as viewActionTypes,
  initialState as viewInitialState,
} from './view';


import regulation, {
  actionCreators as regulationActionCreators,
  actionTypes as regulationActionTypes,
  initialState as regulationInitialState,
} from './regulation';

const actionCreators = {
  ...viewActionCreators,
  ...regulationActionCreators,
};
const actionTypes = {
  ...viewActionTypes,
  ...regulationActionTypes,
};
const initialState = {
  view: viewInitialState,
  regulation: regulationInitialState,
};

export {
  actionTypes,
  actionCreators,
  initialState,
};

export default combineReducers({
  view,
  regulation,
});
