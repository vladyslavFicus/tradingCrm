import { asyncRoute } from '../../router';

export default asyncRoute(() => import(/* webpackChunkName: "Leads" */ './components/Leads'));
