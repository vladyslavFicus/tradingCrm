import { injectReducer } from '../../../../store/reducers';
import { actionCreators as noteTypesActionCreators } from './modules/noteTypes';

export default store => ({
  path: 'notes',
  onEnter: async (nextState, replace, callback) => {
    injectReducer(store, { key: 'userNotes', reducer: require('./modules').default });

    await store.dispatch(noteTypesActionCreators.fetchNoteTypes(nextState.params.id));
    callback();
  },

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./container/ViewContainer').default);
    }, 'user-limits-view');
  },
});
