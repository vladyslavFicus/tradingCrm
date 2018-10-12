import { asyncRoute } from '../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "TeamProfileContainer" */ './containers/TeamProfileContainer'),
);
