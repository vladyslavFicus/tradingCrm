import { injectReducer } from 'store/reducers';
import Permissions, { CONDITIONS } from 'utils/permissions';
import permission from 'config/permissions';

export default (store) => ({
  path: 'player-liability',
  permissions: new Permissions([
    permission.REPORTS.PLAYER_LIABILITY_VIEW,
    permission.REPORTS.PLAYER_LIABILITY_FILE_VIEW,
    permission.REPORTS.PLAYER_LIABILITY_FILES_VIEW,
  ], CONDITIONS.OR),
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, {
        key: 'playerLiabilityReport',
        reducer: require('./modules/index').default,
      });

      cb(null, require('./container/Container').default);
    }, 'player-liability-report');
  },
});
