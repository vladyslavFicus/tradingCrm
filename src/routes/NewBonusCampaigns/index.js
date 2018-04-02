import FulfilmentsRoute from './routes/Fulfilments';
import ListRoute from './routes/List';
import ViewRoute from './routes/View';

export default store => ({
  path: '/campaigns',
  indexRoute: ListRoute(store),
  childRoutes: [
    ViewRoute(store),
    FulfilmentsRoute(store),
  ],
});
