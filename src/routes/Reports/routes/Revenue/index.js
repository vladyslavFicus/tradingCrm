import { injectReducer } from 'store/reducers';
import Permissions from 'utils/permissions';
import permission from 'config/permissions';

export default (store) => ({
  path: '/reports/revenue',
  permissions: new Permissions([permission.REPORTS.VAT_VIEW]),
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, {
        key: 'revenueReport',
        reducer: require('./modules/index').default,
      });

      cb(null, require('./container/Container').default);
    }, 'revenue-report');
  },
});
