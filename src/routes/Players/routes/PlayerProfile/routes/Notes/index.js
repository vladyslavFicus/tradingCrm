import { asyncRoute } from '../../../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "ProfileNotesContainer" */ './containers/ViewContainer'),
  () => import(/* webpackChunkName: "ProfileNotesReducers" */ './modules'),
  'userNotes',
);
