import { injectReducer } from '../../../../store/reducers';

export default store => ({
  path: ':id/notes',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'userNotes', reducer: require('./modules').default });

      cb(null, require('./container/ViewContainer').default);
    }, 'user-limits-view');
  },
});
