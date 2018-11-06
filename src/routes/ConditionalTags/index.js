import { asyncRoute } from '../../router';

export default asyncRoute(() => import(/* webpackChunkName: "ConditionalTags" */ './components/ConditionalTags'));
