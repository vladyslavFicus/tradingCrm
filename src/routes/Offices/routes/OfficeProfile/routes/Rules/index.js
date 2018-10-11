import { asyncRoute } from '../../../../../../router';

export default asyncRoute(() => import(/* webpackChunkName: "OfficeRulesContainer" */ './containers/ViewContainer'));
