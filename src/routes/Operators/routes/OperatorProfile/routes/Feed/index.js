import { asyncRoute } from '../../../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "OperatorFeedContainer" */ './containers/FeedContainer'),
  () => import(/* webpackChunkName: "OperatorFeedReducers" */ './modules'),
  'operatorFeed'
);
