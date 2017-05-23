import { injectReducer } from '../../store/reducers';

export default store => ({
  path: 'countries',
  getComponent(nextState, cb) {
    injectReducer(store, { key: 'countriesList', reducer: require('./modules').default });

    require.ensure([], (require) => {
      cb(null, require('./container/ViewContainer').default);
    }, 'countries-list');
  },
});
