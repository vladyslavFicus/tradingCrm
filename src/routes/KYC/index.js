import childRoutes from './routes';

export default (store) => ({
  path: 'kyc',
  indexRoute: { onEnter: (nextState, replace) => replace('/kyc/in-review-profiles') },
  childRoutes: childRoutes(store),
});
