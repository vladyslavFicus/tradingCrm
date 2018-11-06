import { asyncRoute } from '../../../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "ProfileFeedContainer" */ './containers/ViewContainer'),
  () => import(/* webpackChunkName: "ProfileFeedReducers" */ './modules'),
  'userFeed',
);
