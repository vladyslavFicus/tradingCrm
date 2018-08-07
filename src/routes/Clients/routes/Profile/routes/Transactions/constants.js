import I18n from '../../../../../../utils/fake-i18n';
import Permissions from '../../../../../../utils/permissions';
import permissions from '../../../../../../../src/config/permissions';
import { services } from '../../../../../../constants/services';

const routes = [
  {
    url: '/payments',
    label: I18n.t('CONSTANTS.TRANSACTIONS.ROUTES.PAYMENTS'),
    permissions: new Permissions(permissions.PAYMENTS.PLAYER_PAYMENTS_LIST),
  }, {
    url: '/trading-activity',
    label: I18n.t('CONSTANTS.TRANSACTIONS.ROUTES.TRADING_ACTIVITY'),
    permissions: new Permissions(permissions.TRADING_ACTIVITY.CLIENT_TRADING_ACTIVITY),
    service: services.trading_activity,
  },
];

export { routes };
