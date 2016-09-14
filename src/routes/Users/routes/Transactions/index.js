import { injectReducer } from 'store/reducers';

export default (store) => ({
  path: ':id/transactions',
  getComponents(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'transactionsView', reducer: require('./modules/view').default });
      const TabsComponent = require('../../components/Tabs').default;
      cb(null, {
        content: require('./container/ViewContainer').default,
        tabs: TabsComponent({ activeTabName: 'transactions' }),
      });
    }, 'transactions-view');
  },
});
