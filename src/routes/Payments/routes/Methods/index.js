import { injectReducer } from '../../../../store/reducers';

export default store => ({
  path: 'methods',
  getComponent(nextState, cb) {
    injectReducer(store, { key: 'methodsList', reducer: require('./modules').default });

    require.ensure([], (require) => {
      cb(null, require('./container/ViewContainer').default);
    }, 'methods-list');
  },
});
