import childRoutes from './routes';

export default store => ({
  path: 'users',
  childRoutes: childRoutes(store),
});
