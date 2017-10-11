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

const initialState = {
  transactions: transactionsInitialState,
  filters: filtersInitialState,
};
const actionTypes = {
  ...transactionsActionTypes,
  ...filtersActionTypes,
};
const actionCreators = {
  ...transactionsActionCreators,
  ...filtersActionCreators,
  resetAll: () => (dispatch) => {
    dispatch(transactionsActionCreators.resetTransactions());
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
});
