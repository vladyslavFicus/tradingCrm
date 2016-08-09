import ProfileRoute from './Profile';
import TransactionsRoute from './Transactions';

export default (store) => [
  ProfileRoute(store),
  TransactionsRoute(store),
];
