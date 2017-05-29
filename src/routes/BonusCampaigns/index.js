import ListRoute from './routes/List';
import ViewRoute from './routes/View';

export default store => ({
  path: '/bonus-campaigns',
  indexRoute: ListRoute(store),
  childRoutes: [
    ViewRoute(store),
  ],
});
