import childRoutes from './routes';

export default store => ({
  path: 'settings',
  childRoutes: childRoutes(store),
});
