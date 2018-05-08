import ListRoute from './routes/List';
import CreateRoute from './routes/Create';

export default store => ({
  path: 'fulfillments',
  indexRoute: ListRoute(store),
  childRoutes: [
    CreateRoute(store),
  ],
});
