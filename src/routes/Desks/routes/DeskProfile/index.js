import { asyncRoute } from '../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "DeskProfileContainer" */ './containers/DeskProfileContainer'),
);
