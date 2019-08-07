import { asyncRoute } from '../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "PersonalDashboard" */ './components/PersonalDashboardContainer'),
);
