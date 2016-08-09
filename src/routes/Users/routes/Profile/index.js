import { injectReducer } from 'store/reducers';

export default (store) => ({
  path: '/users/:id/profile',
  getComponents(nextState, cb) {
    require.ensure([], (require) => {
      const TabsComponent = require('../../components/Tabs').default;
      cb(null, {
        content: require('./container/ViewContainer').default,
        tabs: TabsComponent({ activeTabName: 'profile' }),
      });
    }, 'profile-view');
  },
});
