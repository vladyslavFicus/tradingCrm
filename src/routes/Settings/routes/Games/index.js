import { asyncRoute } from '../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "GamesListContainer" */ './container/GamesListContainer'),
  () => import(/* webpackChunkName: "GamesListReducer" */ './modules'),
  'games'
);
