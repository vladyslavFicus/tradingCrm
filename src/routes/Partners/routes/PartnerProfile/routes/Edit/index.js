import { asyncRoute } from '../../../../../../router';

export default asyncRoute(() => import(/* webpackChunkName: "OperatorEditContainer" */ './containers/EditContainer'));
