import { asyncRoute } from '../../../../../../router';

export default asyncRoute(() =>
  import(/* webpackChunkName: "CampaignSettingsContainer" */ './containers/SettingsContainer'));

