import { combineReducers } from 'redux';

import games, {
  actionCreators as gamesActionCreators,
  actionTypes as gamesActionTypes,
  initialState as gamesInitialState,
} from './games';

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
  ...bonusTemplatesActionCreators,
};

const actionTypes = {
  ...gamesActionTypes,
  ...freeSpinTemplatesActionTypes,
  ...paymentsActionTypes,
  ...bonusTemplatesActionTypes,
};

const initialState = {
  games: gamesInitialState,
  freeSpinTemplates: freeSpinTemplatesInitialState,
  bonusTemplates: bonusTemplatesInitialState,
  payments: paymentsInitialState,
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
  bonusTemplates,
});

