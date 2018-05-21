import { asyncRoute } from '../../router';

export default asyncRoute(() =>
  import(/* webpackChunkName: "NotFoundContainer" */ './containers/NotFoundContainer'));
