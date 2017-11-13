import GamesRoute from './Games';
import PaymentMethodsRoute from './PaymentMethods';

export default store => [
  GamesRoute(store),
  PaymentMethodsRoute(store),
];
