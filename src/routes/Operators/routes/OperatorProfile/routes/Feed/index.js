import { asyncRoute } from '../../../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "OperatorFeedContainer" */ './containers/FeedContainer'),
);
