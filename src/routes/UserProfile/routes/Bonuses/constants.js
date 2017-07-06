import I18n from '../../../../utils/fake-i18n';

const routes = {
  '/users/:id/bonuses/bonus': I18n.t('CONSTANTS.BONUS.ROUTES.BONUS'),
  '/users/:id/bonuses/free-spins': I18n.t('CONSTANTS.BONUS.ROUTES.FREE_SPINS'),
  '/users/:id/bonuses/campaigns': I18n.t('CONSTANTS.BONUS.ROUTES.ELIGIBLE_CAMPAIGNS'),
};

export {
  routes,
};
