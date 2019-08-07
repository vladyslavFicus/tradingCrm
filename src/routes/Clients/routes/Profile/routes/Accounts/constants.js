import I18n from 'utils/fake-i18n';
import Permissions from 'utils/permissions';
import permissions from 'config/permissions';

const routes = [{
  url: '/trading-accounts',
  label: I18n.t('CLIENT_PROFILE.ACCOUNTS.ROUTES.TRADING_ACC'),
  permissions: new Permissions(permissions.USER_PROFILE.PROFILE_VIEW),
},
// {
//   url: '/payment-accounts',
//   label: I18n.t('CLIENT_PROFILE.ACCOUNTS.ROUTES.PAYMENT_ACC'),
//   permissions: new Permissions(permissions.USER_PROFILE.PROFILE_VIEW),
// }
];

export { routes };
