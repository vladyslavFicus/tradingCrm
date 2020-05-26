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
      asterisk: {
        isActive: get(config, 'nas.brand.clickToCall.asterisk.isActive', false),
        prefixes: get(config, 'nas.brand.clickToCall.asterisk.prefixes', {}),
      },
    },
    isMT4LiveAvailable: !!get(config, 'nas.brand.mt4.groups'),
    isMT4DemoAvailable: !!get(config, 'nas.brand.mt4.demo_groups'),
    isMT5LiveAvailable: !!get(config, 'nas.brand.mt5.groups'),
    isMT5DemoAvailable: !!get(config, 'nas.brand.mt5.demo_groups'),
    email: {
      templatedEmails: !!get(config, 'nas.brand.email.sendgrid.crm_templated_emails'),
    },
    satellites: get(config, 'nas.brand.satellites'),
    privatePhoneByDepartment: get(config, 'nas.brand.backoffice.privatePhoneByDepartment', []),
    leveragesChangingRequestMT4: get(config, 'nas.brand.mt4.leverages_changing_request', []),
    leveragesChangingRequestMT5: get(config, 'nas.brand.mt5.leverages_changing_request', []),
    privateEmailByDepartment: get(config, 'nas.brand.backoffice.privateEmailByDepartment', []),
  },
}), {});
