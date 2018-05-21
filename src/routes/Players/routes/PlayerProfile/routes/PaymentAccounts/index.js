import { asyncRoute } from '../../../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "ProfilePaymentsContainer" */ './containers/ViewContainer'),
  () => import(/* webpackChunkName: "ProfilePaymentsReducers" */ './modules'),
  'userPaymentAccounts',
);

