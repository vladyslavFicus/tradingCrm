import ListRoute from './routes/List';

export default (store) => ({
  path: 'games',
  indexRoute: ListRoute(store),
});
