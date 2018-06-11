import I18n from '../../../../../../utils/fake-i18n';
import Permissions, { CONDITIONS } from '../../../../../../utils/permissions';
import permissions from '../../../../../../../src/config/permissions';

const routes = [
  {
    url: '/bonuses',
    label: I18n.t('CONSTANTS.BONUS.ROUTES.BONUSES'),
    permissions: new Permissions(permissions.BONUS.PLAYER_BONUSES_LIST),
  },
  {
    url: '/free-spins',
    label: I18n.t('CONSTANTS.BONUS.ROUTES.FREE_SPINS'),
    permissions: new Permissions(permissions.FREE_SPIN.PLAYER_FREE_SPIN_LIST),
  },
  {
    url: '/campaigns',
    label: I18n.t('CONSTANTS.BONUS.ROUTES.ELIGIBLE_CAMPAIGNS'),
    permissions: new Permissions([
      permissions.PROMOTION.PLAYER_CAMPAIGN_ACTIVE_LIST,
      permissions.PROMOTION.PLAYER_CAMPAIGN_AVAILABLE_LIST,
    ], CONDITIONS.OR),
  },
];

export { routes };
