import { injectReducer } from 'store/reducers';

export default (store) => ({
  path: ':id/payments',
  getComponents(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'userPayments', reducer: require('./modules/view').default });
      const TabsComponent = require('../../components/Tabs').default;
      cb(null, {
        content: require('./container/ViewContainer').default,
        tabs: TabsComponent({ activeTabName: 'transactions' }),
      });
    }, 'user-payments-view');
  },
});
