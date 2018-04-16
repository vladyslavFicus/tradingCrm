import FulfilmentsRoute from './routes/Fulfilments';
import ListRoute from './routes/List';
import CampaignViewRoute from './routes/CampaignView';
import CampaignCreate from './routes/CampaignCreate';

export default store => ({
  path: '/campaigns',
  indexRoute: ListRoute(store),
  childRoutes: [
    CampaignViewRoute(store),
    FulfilmentsRoute(store),
    CampaignCreate(store),
  ],
});
