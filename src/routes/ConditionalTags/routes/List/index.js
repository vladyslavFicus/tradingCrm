import { asyncRoute } from '../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "ConditionalTagsListContainer" */ './container/ConditionalTagsListContainer')
);
