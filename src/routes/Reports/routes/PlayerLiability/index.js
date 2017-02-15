import { injectReducer } from 'store/reducers';
import Permissions, { CONDITIONS } from 'utils/permissions';
import permission from 'config/permissions';

const requiredPermissions = new Permissions([
  permission.REPORTS.PLAYER_LIABILITY_VIEW,
  permission.REPORTS.PLAYER_LIABILITY_FILE_VIEW,
  permission.REPORTS.PLAYER_LIABILITY_FILES_VIEW,
], CONDITIONS.OR);

export default (store) => ({
  path: 'player-liability',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      if (!requiredPermissions.check(store.getState().permissions.data)) {
        return cb(null, require('routes/Forbidden/container/Container').default);
      }

      injectReducer(store, {
        key: 'playerLiabilityReport',
        reducer: require('./modules/index').default,
      });

      cb(null, require('./container/Container').default);
    }, 'player-liability-report');
  },
});
