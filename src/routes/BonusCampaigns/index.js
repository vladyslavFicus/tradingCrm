import ListRoute from './routes/List';
import ViewRoute from './routes/View';
import CreateRoute from './routes/Create';

export default store => ({
  path: '/bonus-campaigns',
  indexRoute: ListRoute(store),
  childRoutes: [
    ViewRoute(store),
    CreateRoute(store),
  ],
});
