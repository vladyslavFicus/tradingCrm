import { injectReducer } from 'store/reducers';
import { actionTypes, actionCreators } from './modules/view';

export default store => ({
  path: 'view/:id',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      if (!!nextState.params.id) {
        injectReducer(store, {
          key: 'termsView',
          reducer: require('./modules/view').default,
        });

        store.dispatch(actionCreators.fetchTerm(nextState.params.id))
          .then((action) => {
            if (actionTypes.FETCH_TERM.SUCCESS === action.type) {
              cb(null, require('./container/Container').default);
            } else {
              cb(null, require('routes/NotFound/container/Container').default);
            }
          });
      } else {
        cb(null, require('routes/NotFound/container/Container').default);
      }
    }, 'term-view');
  },
});
