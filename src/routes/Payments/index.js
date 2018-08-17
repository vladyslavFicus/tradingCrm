import { asyncRoute } from '../../router';

export default asyncRoute(() => import(/* webpackChunkName: "Payments" */ './components/Payments'));
