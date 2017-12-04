import { injectReducer } from '../../../../store/reducers';

export default store => ({
  path: 'list',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'operatorsList', reducer: require('./modules/list').default });

      cb(null, require('./container/Container').default);
    }, 'operators-list');
  },
});
