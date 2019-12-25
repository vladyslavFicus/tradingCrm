import { asyncRoute } from 'router';

export default asyncRoute(() => import(/* webpackChunkName: "ProfileRisk" */ './components/Risks'));
