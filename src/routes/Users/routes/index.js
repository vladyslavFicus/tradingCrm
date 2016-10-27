import ProfileRoute from './Profile';
import TransactionsRoute from './Transactions';
import BonusesRoute from './Bonuses';

export default (store) => [
  ProfileRoute(store),
  TransactionsRoute(store),
  BonusesRoute(store),
];
