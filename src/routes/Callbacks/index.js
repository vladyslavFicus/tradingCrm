import { asyncRoute } from '../../router';

export default asyncRoute(() => import(/* webpackChunkName: "Callbacks" */ './components/Callbacks'));
