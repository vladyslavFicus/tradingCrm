import SettingsRoute from './routes/Settings';

export default store => ({
  path: 'view/:id',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./container/CampaignViewContainer').default);
    }, 'campaign-view');
  },
  childRoutes: [
    SettingsRoute(store),
  ],
});
