import { asyncRoute } from '../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "PaymentMethodsContainer" */ './container/PaymentMethodsContainer'),
  () => import(/* webpackChunkName: "PaymentMethodsReducer" */ './modules'),
  'paymentMethodsList',
);
