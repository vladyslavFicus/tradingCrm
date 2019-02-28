import { asyncRoute } from '../../../../../../router';

export default asyncRoute(() => import(/* webpackChunkName: "ProfileFeedContainer" */ './containers/ViewContainer'));
