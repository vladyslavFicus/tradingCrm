import { asyncRoute } from '../../router';

export default asyncRoute(() => import(/* webpackChunkName: "Reports" */ './components/Reports'));
