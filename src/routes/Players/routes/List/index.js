import { asyncRoute } from '../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "ListContainer" */ './containers/ListContainer'),
  () => import(/* webpackChunkName: "ListReducers" */ './modules/list'),
  'usersList'
);
