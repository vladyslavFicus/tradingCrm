import { injectReducer } from 'store/reducers';

export default (store) => ({
  path: ':id/documents',
  getComponent(nextState, cb) {
    injectReducer(store, { key: 'userDocuments', reducer: require('./modules/files').default });

    require.ensure([], (require) => {
      cb(null, require('./container/ViewContainer').default);
    }, 'documents-view');
  },
});
