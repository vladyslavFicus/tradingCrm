import I18n from '../../../../utils/fake-i18n';

const routes = {
  '/users/:id/awards/bonus': I18n.t('CONSTANTS.BONUS.ROUTES.BONUS'),
  '/users/:id/awards/free-spins': I18n.t('CONSTANTS.BONUS.ROUTES.FREE_SPINS'),
  '/users/:id/awards/campaigns': I18n.t('CONSTANTS.BONUS.ROUTES.ELIGIBLE_CAMPAIGNS'),
};

export {
  routes,
};
