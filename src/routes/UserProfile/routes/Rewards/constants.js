import I18n from '../../../../utils/fake-i18n';

const routes = {
  '/users/:id/rewards/bonuses': I18n.t('CONSTANTS.BONUS.ROUTES.BONUSES'),
  '/users/:id/rewards/free-spins': I18n.t('CONSTANTS.BONUS.ROUTES.FREE_SPINS'),
  '/users/:id/rewards/campaigns': I18n.t('CONSTANTS.BONUS.ROUTES.ELIGIBLE_CAMPAIGNS'),
};

export {
  routes,
};
