import ProfileRoute from './Profile';
import GameActivityRoute from './GameActivity';
import TransactionsRoute from './Transactions';
import BonusesRoute from './Bonuses';
import LimitsRoute from './Limits';

export default (store) => [
  ProfileRoute(store),
  GameActivityRoute(store),
  TransactionsRoute(store),
  BonusesRoute(store),
  LimitsRoute(store),
];
