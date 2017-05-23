import { injectReducer } from '../../../../store/reducers';

export default store => ({
  path: ':id/devices',
  getComponent(nextState, cb) {
    injectReducer(store, { key: 'userDevices', reducer: require('./modules').default });

    require.ensure([], (require) => {
      cb(null, require('./container/ViewContainer').default);
    }, 'user-profile-devices-view');
  },
});
