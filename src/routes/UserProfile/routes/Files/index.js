import { injectReducer } from '../../../../store/reducers';

export default store => ({
  path: ':id/files',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'userFiles', reducer: require('./modules/index').default });

      cb(null, require('./container/ViewContainer').default);
    }, 'user-profile-files-view');
  },
});
