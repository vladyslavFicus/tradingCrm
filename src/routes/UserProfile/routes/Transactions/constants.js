import I18n from '../../../../utils/fake-i18n';

const routes = {
  '/users/:id/transactions/payments': I18n.t('CONSTANTS.TRANSACTIONS.ROUTES.PAYMENTS'),
  '/users/:id/transactions/game-activity': I18n.t('CONSTANTS.TRANSACTIONS.ROUTES.GAMING_ACTIVITY'),
};

export {
  routes,
};
