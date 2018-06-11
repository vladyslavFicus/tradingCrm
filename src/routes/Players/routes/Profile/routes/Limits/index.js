import { asyncRoute } from '../../../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "ProfileLimitsContainer" */ './containers/ViewContainer'),
  () => import(/* webpackChunkName: "ProfileLimitsReducers" */ './modules'),
  'userLimits',
);
