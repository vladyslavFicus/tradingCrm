import Permissions from '../../../../utils/permissions';
import permission from '../../../../config/permissions';

const requiredPermissions = new Permissions([permission.CAMPAIGNS.CREATE]);

export default store => ({
  path: 'create',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      if (!requiredPermissions.check(store.getState().permissions.data)) {
        return cb(null, require('../../../Forbidden/container/Container').default);
      }

      cb(null, require('./container/CampaignCreateContainer').default);
    }, 'new-bonus-campaign-create');
  },
});
