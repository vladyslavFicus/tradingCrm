import { injectReducer } from 'store/reducers';

export default (store) => ({
  path: '/users/view/:id',
  getComponents(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'userProfile', reducer: require('./modules/view').default });

      cb(null, { content: require('./container/ViewContainer').default });
    }, 'user-view');
  }
});
