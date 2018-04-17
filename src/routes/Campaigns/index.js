import FulfilmentsRoute from './routes/Fulfilments';
import ListRoute from './routes/List';
import CampaignViewRoute from './routes/View';
import CampaignCreateRoute from './routes/Create';

export default store => ({
  path: '/campaigns',
  indexRoute: ListRoute(store),
  childRoutes: [
    CampaignViewRoute(store),
    FulfilmentsRoute(store),
    CampaignCreateRoute(),
  ],
});
