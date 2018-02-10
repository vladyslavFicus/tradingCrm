import FulfilmentsRoute from './routes/Fulfilments';

export default store => ({
  path: '/new-bonus-campaigns',
  childRoutes: [
    FulfilmentsRoute(store),
  ],
});
