import routes from './routes';

export default store => ({
  childRoutes: routes(store),
});
