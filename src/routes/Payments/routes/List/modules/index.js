import { combineReducers } from 'redux';

import transactions, {
  initialState as transactionsInitialState,
  actionTypes as transactionsActionTypes,
  actionCreators as transactionsActionCreators,
} from './transactions';
import players, {
  initialState as playersInitialState,
  actionTypes as playersActionTypes,
  actionCreators as playersActionCreators,
} from './players';

const initialState = {
  transactions: transactionsInitialState,
  players: playersInitialState,
};
const actionTypes = {
  ...transactionsActionTypes,
  ...playersActionTypes,
};
const actionCreators = {
  ...transactionsActionCreators,
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
  players,
});
