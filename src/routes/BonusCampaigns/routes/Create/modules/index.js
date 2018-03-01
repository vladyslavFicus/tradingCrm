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

import freeSpinTemplates, {
  actionCreators as freeSpinTemplatesActionCreators,
  actionTypes as freeSpinTemplatesActionTypes,
  initialState as freeSpinTemplatesInitialState,
} from './freeSpinTemplates';

import bonusTemplates, {
  actionCreators as bonusTemplatesActionCreators,
  actionTypes as bonusTemplatesActionTypes,
  initialState as bonusTemplatesInitialState,
} from './bonusTemplates';

import payments, {
  actionCreators as paymentsActionCreators,
  actionTypes as paymentsActionTypes,
  initialState as paymentsInitialState,
} from './payments';

const actionCreators = {
  ...gamesActionCreators,
  ...freeSpinTemplatesActionCreators,
  ...paymentsActionCreators,
  ...createActionCreators,
  ...bonusTemplatesActionCreators,
};

const actionTypes = {
  ...gamesActionTypes,
  ...freeSpinTemplatesActionTypes,
  ...paymentsActionTypes,
  ...createActionTypes,
  ...bonusTemplatesActionTypes,
};

const initialState = {
  games: gamesInitialState,
  freeSpinTemplates: freeSpinTemplatesInitialState,
  payments: paymentsInitialState,
  create: createInitialState,
  bonusTemplates: bonusTemplatesInitialState,
};

export {
  actionTypes,
  actionCreators,
  initialState,
};

export default combineReducers({
  games,
  freeSpinTemplates,
  payments,
  create,
  bonusTemplates,
});

