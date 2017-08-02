import { injectReducer } from '../../../../store/reducers';
import { actionCreators as deviceTypesActionCreators } from './modules';

export default store => ({
  path: 'devices',
  onEnter: async (nextState, replace, callback) => {
    await store.dispatch(deviceTypesActionCreators.fetchFilters(nextState.params.id));
    callback();
  },

  getComponent(nextState, cb) {
    injectReducer(store, { key: 'userDevices', reducer: require('./modules').default });

    require.ensure([], (require) => {
      cb(null, require('./container/ViewContainer').default);
    }, 'user-profile-devices-view');
  },
});
