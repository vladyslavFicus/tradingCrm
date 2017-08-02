import { injectReducer } from '../../../../store/reducers';

export default store => ({
  path: 'limits',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'userLimits', reducer: require('./modules').default });

      cb(null, require('./container/ViewContainer').default);
    }, 'user-limits-view');
  },
});
