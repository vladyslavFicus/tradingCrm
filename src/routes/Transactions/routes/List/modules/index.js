import { combineReducers } from 'redux';

import transactions, {
  initialState as transactionsInitialState,
  actionTypes as transactionsActionTypes,
  actionCreators as transactionsActionCreators,
} from './transactions';
import filters, {
  initialState as filtersInitialState,
  actionTypes as filtersActionTypes,
  actionCreators as filtersActionCreators,
} from './filters';
import players, {
  initialState as playersInitialState,
  actionTypes as playersActionTypes,
  actionCreators as playersActionCreators,
} from './players';

const initialState = {
  transactions: transactionsInitialState,
  filters: filtersInitialState,
  players: playersInitialState,
};
const actionTypes = {
  ...transactionsActionTypes,
  ...filtersActionTypes,
  ...playersActionTypes,
};
const actionCreators = {
  ...transactionsActionCreators,
  ...filtersActionCreators,
  ...playersActionCreators,
  resetAll: () => (dispatch) => {
    dispatch(transactionsActionCreators.resetTransactions());
    dispatch(playersActionCreators.resetPlayerProfiles());
  },
};

export {
  initialState,
  actionTypes,
  actionCreators,
};

export default combineReducers({
  transactions,
  filters,
  players,
});
