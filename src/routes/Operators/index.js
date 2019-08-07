import { asyncRoute } from '../../router';

export default asyncRoute(() => import(/* webpackChunkName: "Operators" */ './components/Operators'));
