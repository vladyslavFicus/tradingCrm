import { asyncRoute } from '../../router';

export default asyncRoute(() => import(/* webpackChunkName: "Teams" */ './components/Teams'));
