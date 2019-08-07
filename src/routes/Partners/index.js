import { asyncRoute } from '../../router';

export default asyncRoute(() => import(/* webpackChunkName: "Partners" */ './components/Partners'));
