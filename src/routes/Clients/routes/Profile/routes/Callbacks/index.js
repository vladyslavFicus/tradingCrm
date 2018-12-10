import { asyncRoute } from '../../../../../../router';

export default asyncRoute(() => import(/* webpackChunkName: "ProfileCallbacks" */ './components/Callbacks'));
