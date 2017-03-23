import { injectReducer } from '../../../../store/reducers';
import { actionCreators } from './modules/index';

export default store => ({
  path: ':id/files',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'userFiles', reducer: require('./modules/index').default });

      cb(null, require('./container/ViewContainer').default);
    }, 'user-profile-files-view');
  },
});
