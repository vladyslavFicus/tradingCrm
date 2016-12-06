import { injectReducer } from 'store/reducers';

export default (store) => ({
  path: ':id/game-activity',
  getComponents(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'userGameActivity', reducer: require('./modules/view').default });
      const TabsComponent = require('../../components/Tabs').default;
      cb(null, {
        content: require('./container/ViewContainer').default,
        tabs: TabsComponent({ activeTabName: 'gameActivity' }),
      });
    }, 'game-activity-view');
  },
});
