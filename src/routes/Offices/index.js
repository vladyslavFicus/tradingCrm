import { asyncRoute } from '../../router';

export default asyncRoute(() => import(/* webpackChunkName: "Offices" */ './components/Offices'));
