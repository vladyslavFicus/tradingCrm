import { asyncRoute } from '../../../../../../router';

export default asyncRoute(() => import(/* webpackChunkName: "ProfileTransactionsContainer" */ './containers/TransactionsContainer'));
