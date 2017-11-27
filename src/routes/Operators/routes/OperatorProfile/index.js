import { injectReducer } from '../../../../store/reducers';
import { actionCreators } from './modules';
import EditRoute from './routes/Edit';
import FeedRoute from './routes/Feed';

export default store => ({
  path: 'operators/:id',
  onEnter: async (nextState, replace, callback) => {
    injectReducer(store, { key: 'operatorProfile', reducer: require('./modules').default });

    await store.dispatch(actionCreators.fetchProfile(nextState.params.id));

    callback();
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const { operatorProfile: { view: operatorProfile } } = store.getState();

      if (operatorProfile && operatorProfile.error) {
        return cb(null, require('../../../NotFound/container/Container').default);
      }

      cb(null, require('./container/ViewContainer').default);
    }, 'operator-profile-layout');
  },
  childRoutes: [
    EditRoute(store),
    FeedRoute(store),
  ],
});
