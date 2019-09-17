const { get } = require('lodash');

module.exports = configs => Object.entries(configs).reduce((acc, [id, config]) => ({
  ...acc,
  [id]: {
    id,
    currencies: get(config, 'nas.brand.currencies'),
    locales: get(config, 'nas.brand.locale'),
    password: get(config, 'nas.brand.password'),
    payment: {
      reasons: get(config, 'nas.brand.payment.reasons'),
    },
    regulation: {
      isActive: get(config, 'nas.brand.regulation.isActive', false),
    },
    clickToCall: {
      isActive: get(config, 'nas.brand.clickToCall.isActive', false),
      url: get(config, 'nas.brand.clickToCall.url'),
    },
    isDemoAvailable: !!get(config, 'nas.brand.mt4.demo_groups'),
  },
}), {});
