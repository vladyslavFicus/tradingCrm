import childRoutes from './routes';

export default (store) => ({
  path: 'operators',
  childRoutes: childRoutes(store),
});
