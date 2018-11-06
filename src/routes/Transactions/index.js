import { asyncRoute } from '../../router';

export default asyncRoute(() => import(/* webpackChunkName: "Transactions" */ './components/Transactions'));
