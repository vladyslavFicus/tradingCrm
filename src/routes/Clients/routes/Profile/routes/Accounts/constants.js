import Permissions from 'utils/permissions';
import permissions from 'config/permissions';

const routes = [{
  url: '/trading-accounts',
  label: 'CLIENT_PROFILE.ACCOUNTS.ROUTES.TRADING_ACC',
  permissions: new Permissions(permissions.USER_PROFILE.PROFILE_VIEW),
},
// {
//   url: '/payment-accounts',
//   label: 'CLIENT_PROFILE.ACCOUNTS.ROUTES.PAYMENT_ACC',
//   permissions: new Permissions(permissions.USER_PROFILE.PROFILE_VIEW),
// }
];

export { routes };
