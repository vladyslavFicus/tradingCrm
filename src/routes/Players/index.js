import { asyncRoute } from '../../router';

export default asyncRoute(() => import(/* webpackChunkName: "Players" */ './components/Players'));
