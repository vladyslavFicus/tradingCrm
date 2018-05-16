import CmsGamesRoute from './CmsGames';
import GamesRoute from './Games';
import PaymentMethodsRoute from './PaymentMethods';

export default store => [
  CmsGamesRoute(store),
  GamesRoute(store),
  PaymentMethodsRoute(store),
];
