import { asyncRoute } from '../../router';

export default asyncRoute(() => import(/* webpackChunkName: "Desks" */ './components/Desks'));
