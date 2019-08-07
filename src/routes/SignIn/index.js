import { asyncRoute } from '../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "SignInContainer" */ './containers/SignInContainer'),
  () => import(/* webpackChunkName: "SignInReducers" */ './modules/signIn'),
  'signIn',
);
