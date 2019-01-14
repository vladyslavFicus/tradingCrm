import { asyncRoute } from '../../../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "LeadNotesContainer" */ './containers/ViewContainer'),
);
