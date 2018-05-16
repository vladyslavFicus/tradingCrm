import { asyncRoute } from '../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "SetPasswordContainer" */ './containers/SetPasswordContainer'),
  () => import(/* webpackChunkName: "SetPasswordReducers" */ './modules'),
  'passwordResetView'
);
