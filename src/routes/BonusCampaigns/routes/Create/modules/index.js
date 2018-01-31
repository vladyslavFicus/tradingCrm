import { combineReducers } from 'redux';

import games, {
  actionCreators as gamesActionCreators,
  actionTypes as gamesActionTypes,
  initialState as gamesInitialState,
} from './games'
  ;
import create, {
  actionCreators as createActionCreators,
  actionTypes as createActionTypes,
  initialState as createInitialState,
} from './create';

import templates, {
  actionCreators as templatesActionCreators,
  actionTypes as templatesActionTypes,
  initialState as templatesInitialState,
} from './templates';

import payments, {
  actionCreators as paymentsActionCreators,
  actionTypes as paymentsActionTypes,
  initialState as paymentsInitialState,
} from './payments';

const actionCreators = {
  ...gamesActionCreators,
  ...templatesActionCreators,
  ...paymentsActionCreators,
  ...createActionCreators,
};

const actionTypes = {
  ...gamesActionTypes,
  ...templatesActionTypes,
  ...paymentsActionTypes,
  ...createActionTypes,
};

const initialState = {
  games: gamesInitialState,
  templates: templatesInitialState,
  payments: paymentsInitialState,
  create: createInitialState,
};

export {
  actionTypes,
  actionCreators,
  initialState,
};

export default combineReducers({
  games,
  templates,
  payments,
  create,
});

