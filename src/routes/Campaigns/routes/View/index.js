import SettingsRoute from './routes/Settings';
import Permissions from '../../../../utils/permissions';
import permission from '../../../../config/permissions';

const requiredPermissions = new Permissions([permission.CAMPAIGNS.VIEW]);

export default store => ({
  path: 'view/:id',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      if (!requiredPermissions.check(store.getState().permissions.data)) {
        return cb(null, require('../../../Forbidden/containers/ForbiddenContainer').default);
      }

      cb(null, require('./container/CampaignViewContainer').default);
    }, 'campaign-view');
  },
  childRoutes: [
    SettingsRoute(store),
  ],
});
