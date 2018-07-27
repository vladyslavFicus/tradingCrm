import { asyncRoute } from '../../router';

export default asyncRoute(() => import(/* webpackChunkName: "Clients" */ './components/Clients'));
