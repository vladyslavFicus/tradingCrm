import { asyncRoute } from 'router';

export default asyncRoute(() => import(/* webpackChunkName: "Hierarchy" */ './components/Hierarchy'));
