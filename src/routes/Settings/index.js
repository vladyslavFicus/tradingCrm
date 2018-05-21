import { asyncRoute } from '../../router';

export default asyncRoute(() => import(/* webpackChunkName: "Settings" */ './components/Settings'));
