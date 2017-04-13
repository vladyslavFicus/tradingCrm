import ListRoute from './routes/List';
import routes from './routes';

export default store => ({
  path: 'payments',
  indexRoute: ListRoute(store),
  childRoutes: routes(store),
});
