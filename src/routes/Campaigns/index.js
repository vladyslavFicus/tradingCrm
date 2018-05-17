import { asyncRoute } from '../../router';

export default asyncRoute(() => import(/* webpackChunkName: "Campaigns" */ './components/Campaigns'));
