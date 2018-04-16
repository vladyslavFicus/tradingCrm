import SettingsRoute from './routes/Settings';
import Permissions from '../../../../utils/permissions';
import permission from '../../../../config/permissions';

const requiredPermissions = new Permissions([permission.CAMPAIGNS.VIEW]);

export default store => ({
  path: 'view/:id',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      if (!requiredPermissions.check(store.getState().permissions.data)) {
        return cb(null, require('../../../Forbidden/container/Container').default);
      }

      cb(null, require('./container/CampaignViewContainer').default);
    }, 'new-bonus-campaign-list');
  },
  childRoutes: [
    SettingsRoute(store),
  ],
});
