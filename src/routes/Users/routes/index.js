import ProfileRoute from './Profile';
import TransactionsRoute from './Transactions';
import BonusesRoute from './Bonuses';
import ReviewRoute from './Review';

export default (store) => [
  ProfileRoute(store),
  TransactionsRoute(store),
  BonusesRoute(store),
  ReviewRoute(store),
];
