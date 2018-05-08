import FulfillmentsRoute from './routes/Fulfillments';
import ListRoute from './routes/List';
import CampaignViewRoute from './routes/View';
import CampaignCreateRoute from './routes/Create';

export default store => ({
  path: '/campaigns',
  indexRoute: ListRoute(store),
  childRoutes: [
    CampaignViewRoute(store),
    FulfillmentsRoute(store),
    CampaignCreateRoute(store),
  ],
});
