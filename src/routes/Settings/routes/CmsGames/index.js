import { asyncRoute } from '../../../../router';

export default asyncRoute(() => import(/* webpackChunkName: "CmsGamesContainer" */ './container/CmsGamesContainer'));
