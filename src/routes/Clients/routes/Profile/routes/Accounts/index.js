import { asyncRoute } from '../../../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "ProfileAccountsContainer" */ './containers/AccountsContainer'),
);
