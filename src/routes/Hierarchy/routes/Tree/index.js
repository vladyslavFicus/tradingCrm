import { asyncRoute } from 'router';

export default asyncRoute(
  () => import(/* webpackChunkName: "HierarchyUserBranchList" */ './components/HierarchyUserBranchList'),
);
