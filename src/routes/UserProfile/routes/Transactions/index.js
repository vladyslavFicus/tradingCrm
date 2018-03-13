import getChildRoutes from './routes';
import { injectReducer } from '../../../../store/reducers';
import { actionCreators as subTabActionCreators } from '../../modules/subtabs';
import { routes } from './constants';

export default store => ({
  path: 'transactions',
  onEnter: async (nextState, replace, cb) => {
    injectReducer(store, {
      key: 'userTransactionsSubTabs',
      reducer: require('../../modules/subtabs').default,
    });

    if (nextState.location && /transactions$/.test(nextState.location.pathname)) {
      const { permissions: { data: currentPermissions } } = store.getState();

      await store.dispatch(subTabActionCreators.initSubTabs(currentPermissions, routes));

      const { userTransactionsSubTabs } = store.getState();
      const [{ url: firstTabUrl }] = userTransactionsSubTabs.tabs;

      replace(firstTabUrl.replace(':id', nextState.params.id));
    }

    cb();
  },
  childRoutes: getChildRoutes(store),
});

