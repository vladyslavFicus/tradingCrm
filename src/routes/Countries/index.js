import { injectReducer } from '../../store/reducers';
import reducer from './modules';

export default store => ({
  path: 'countries',
  getComponent(nextState, cb) {
    injectReducer(store, { key: 'countriesList', reducer });

    require.ensure([], (require) => {
      cb(null, require('./container/ViewContainer').default);
    }, 'countries-list');
  },
});
