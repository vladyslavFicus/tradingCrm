import { asyncRoute } from '../../../../router';

export default asyncRoute(() =>
  import(/* webpackChunkName: "CampaignCreateContainer" */ './containers/CampaignCreateContainer'));

