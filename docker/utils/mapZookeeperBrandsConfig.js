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
    email: {
      templatedEmails: !!get(config, 'nas.brand.email.sendgrid.crm_templated_emails'),
    },
    isDemoAvailable: !!get(config, 'nas.brand.mt4.demo_groups'),
    isRisksTabAvailable: !!get(config, 'nas.brand.backoffice.riskCalculator'),
    fsaRegulation: !!get(config, 'nas.brand.backoffice.fsaRegulation'),
    privatePhoneByDepartment: get(config, 'nas.brand.backoffice.privatePhoneByDepartment', []),
  },
}), {});
