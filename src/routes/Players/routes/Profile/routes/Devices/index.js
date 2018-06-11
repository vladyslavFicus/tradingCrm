import { asyncRoute } from '../../../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "ProfileDevicesContainer" */ './containers/ViewContainer'),
  () => import(/* webpackChunkName: "ProfileDevicesReducers" */ './modules'),
  'userDevices',
);
