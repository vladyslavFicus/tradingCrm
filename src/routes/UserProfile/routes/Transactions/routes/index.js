import PaymentsRoute from './Payments';
import GameActivityRoute from './GameActivity';

export default store => [
  PaymentsRoute(store),
  GameActivityRoute(store),
];
