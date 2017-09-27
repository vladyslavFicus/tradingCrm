import RevenueRoute from './routes/Revenue';
import PlayerLiabilityRoute from './routes/PlayerLiability';

export default store => ({
  path: 'reports',
  childRoutes: [
    PlayerLiabilityRoute(store),
    RevenueRoute(store),
  ],
});
