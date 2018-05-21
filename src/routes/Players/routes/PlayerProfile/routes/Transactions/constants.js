import I18n from '../../../../../../utils/fake-i18n';
import Permissions from '../../../../../../utils/permissions';
import permissions from '../../../../../../../src/config/permissions';

const routes = [
  {
    url: '/payments',
    label: I18n.t('CONSTANTS.TRANSACTIONS.ROUTES.PAYMENTS'),
    permissions: new Permissions(permissions.PAYMENTS.PLAYER_PAYMENTS_LIST),
  },
  {
    url: '/game-activity',
    label: I18n.t('CONSTANTS.TRANSACTIONS.ROUTES.GAMING_ACTIVITY'),
    permissions: new Permissions(permissions.GAMING_ACTIVITY.PLAYER_GAMING_ACTIVITY),
  },
];

export { routes };
