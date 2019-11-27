import { asyncRoute } from 'router';

export default asyncRoute(
  () => import(/* webpackChunkName: "ProfileAccounts" */ './components/Accounts'),
);
