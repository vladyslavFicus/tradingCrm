import { injectReducer } from '../../../../store/reducers';

export default store => ({
  path: ':id/files',
  getComponent(nextState, cb) {
    injectReducer(store, { key: 'userFiles', reducer: require('./modules').default });

    require.ensure([], (require) => {
      cb(null, require('./container/ViewContainer').default);
    }, 'user-profile-files-view');
  },
});
