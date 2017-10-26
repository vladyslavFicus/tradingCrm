import { injectReducer } from '../../../../store/reducers';
import Permissions from '../../../../utils/permissions';
import permission from '../../../../config/permissions';

const requiredPermissions = new Permissions([permission.REPORTS.VAT_VIEW]);

export default store => ({
  path: '/reports/revenue',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      if (!requiredPermissions.check(store.getState().permissions.data)) {
        return cb(null, require('../../../Forbidden/container/Container').default);
      }

      injectReducer(store, {
        key: 'revenueReport',
        reducer: require('./modules/index').default,
      });

      cb(null, require('./container/Container').default);
    }, 'revenue-report');
  },
});
