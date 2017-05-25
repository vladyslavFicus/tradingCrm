import CreateRoute from './routes/Create';
import UpdateRoute from './routes/Update';
import ListRoute from './routes/List';

export default store => ({
  path: '/bonus-campaigns',
  indexRoute: ListRoute(store),
  childRoutes: [
    CreateRoute(store),
    UpdateRoute(store),
  ],
});
