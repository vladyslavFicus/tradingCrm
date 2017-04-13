import { combineReducers } from 'redux';

import transactions, {
  initialState as transactionsInitialState,
  actionTypes as transactionsActionTypes,
  actionCreators as transactionsActionCreators,
} from './transactions';

const initialState = {
  transactions: transactionsInitialState,
};
const actionTypes = {
  ...transactionsActionTypes,
};
const actionCreators = {
  ...transactionsActionCreators,
};

export {
  initialState,
  actionTypes,
  actionCreators,
};

export default combineReducers({
  transactions,
});
