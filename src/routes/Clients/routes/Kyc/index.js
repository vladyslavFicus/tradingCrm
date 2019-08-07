import { asyncRoute } from '../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "PlayersKycContainer" */ './containers/KycContainer'),
  () => import(/* webpackChunkName: "PlayersKycReducer" */ './modules/list'),
  'kycRequests',
);
