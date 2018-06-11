import { asyncRoute } from '../../../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "ProfileFileContainer" */ './containers/ViewContainer'),
  () => import(/* webpackChunkName: "ProfileFilesReducers" */ './modules'),
  'userFiles',
);
