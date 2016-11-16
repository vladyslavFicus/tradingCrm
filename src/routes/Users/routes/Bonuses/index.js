import { injectReducer } from 'store/reducers';

export default (store) => ({
  path: ':id/bonuses',
  getComponents(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'userBonusesList', reducer: require('./modules/list').default });
      const TabsComponent = require('../../components/Tabs').default;
      cb(null, {
        content: require('./container/Bonuses').default,
        tabs: TabsComponent({ activeTabName: 'bonuses' }),
      });
    }, 'user-bonuses-list');
  },
});
