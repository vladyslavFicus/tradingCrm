import { asyncRoute } from '../../../../router';

export default asyncRoute(() =>
  import(/* webpackChunkName: "CampaignListContainer" */ './container/CampaignListContainer')
);

