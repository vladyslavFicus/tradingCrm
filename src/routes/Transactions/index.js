import { injectReducer } from '../../store/reducers';

export default (store) => ({
  path: '/transactions',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, {
        key: 'transactionsList',
        reducer: require('./modules/transactions-list').default,
      });

      cb(null, require('./components/List').default);
    }, 'users-list');
  },
});
