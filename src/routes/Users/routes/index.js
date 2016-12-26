import ProfileRoute from './Profile';
import GameActivityRoute from './GameActivity';
import PaymentsRoute from './Payments';
import BonusesRoute from './Bonuses';
import LimitsRoute from './Limits';

export default (store) => [
  ProfileRoute(store),
  GameActivityRoute(store),
  PaymentsRoute(store),
  BonusesRoute(store),
  LimitsRoute(store),
];
