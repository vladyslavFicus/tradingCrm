import { asyncRoute } from '../../router';

export default asyncRoute(() => import(/* webpackChunkName: "SalesRules" */ './components/SalesRules'));
