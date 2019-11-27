import { asyncRoute } from '../../router';

export default asyncRoute(() => import(/* webpackChunkName: "Dashboard" */ './Dashboard'));
