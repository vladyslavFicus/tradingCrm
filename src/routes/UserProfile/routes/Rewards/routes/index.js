import BonusListRoute from './Bonuses';
import CampaignListRoute from './Campaigns';
import FreeSpinListRoute from './FreeSpins';

export default store => [
  BonusListRoute(store),
  CampaignListRoute(store),
  FreeSpinListRoute(store),
];
