import { asyncRoute } from '../../../../../../router';

export default asyncRoute(() => import(/* webpackChunkName: "ProfileContainer" */ './containers/ViewContainer'));
