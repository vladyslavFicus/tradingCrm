import getChildRoutes from './routes';
import { injectReducer } from '../../../../store/reducers';
import { actionCreators as subTabActionCreators } from '../../modules/subtabs';
import { routes } from './constants';

export default store => ({
  path: 'rewards',
  onEnter: async (nextState, replace, cb) => {
    injectReducer(store, {
      key: 'userRewardsSubTabs',
      reducer: require('../../modules/subtabs').default,
    });

    if (nextState.location && /rewards$/.test(nextState.location.pathname)) {
      const { permissions: { data: currentPermissions } } = store.getState();

      await store.dispatch(subTabActionCreators.initSubTabs(currentPermissions, routes));

      const { userRewardsSubTabs } = store.getState();
      const [{ url: firstTabUrl }] = userRewardsSubTabs.tabs;

      replace(firstTabUrl.replace(':id', nextState.params.id));
    }

    cb();
  },
  childRoutes: getChildRoutes(store),
});

