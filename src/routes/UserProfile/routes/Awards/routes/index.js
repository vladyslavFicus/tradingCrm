import BonusListRoute from './Bonus';
import CampaignListRoute from './Campaign';
import FreeSpinListRoute from './FreeSpin';

export default store => [
  BonusListRoute(store),
  CampaignListRoute(store),
  FreeSpinListRoute(store),
];
