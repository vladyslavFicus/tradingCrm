import { asyncRoute } from '../../../../../../router';

export default asyncRoute(() => import(/* webpackChunkName: "ProfileRewardsContainer" */ './containers/RewardsContainer'));
