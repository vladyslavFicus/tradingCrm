import ProfileRoute from './Profile';
import TransactionsRoute from './Transactions';
import BonusesRoute from './Bonuses';
import ReviewProfileRoute from './ReviewProfile';

export default (store) => [
  ProfileRoute(store),
  TransactionsRoute(store),
  BonusesRoute(store),
  ReviewProfileRoute(store),
];
