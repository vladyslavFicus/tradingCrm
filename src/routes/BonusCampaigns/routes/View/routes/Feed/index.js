import { asyncRoute } from '../../../../../../router';

export default asyncRoute(() => import(/* webpackChunkName: "BonusCampaignFeed" */ './components/Feed'));

