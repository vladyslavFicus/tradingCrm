import { asyncRoute } from 'router';

export default asyncRoute(
  () => import(/* webpackChunkName: "PartnersListContainer" */ './containers/PartnersListContainer'),
  () => import(/* webpackChunkName: "PartnersListReducers" */ './modules/list'),
  'partnersList',
);
