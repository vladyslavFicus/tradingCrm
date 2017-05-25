import CreateRoute from './routes/Create';
import UpdateRoute from './routes/Update';
import ListRoute from './routes/List';
import ViewRoute from './routes/View';

export default store => ({
  path: '/bonus-campaigns',
  indexRoute: ListRoute(store),
  childRoutes: [
    CreateRoute(store),
    UpdateRoute(store),
    ViewRoute(store),
  ],
});
