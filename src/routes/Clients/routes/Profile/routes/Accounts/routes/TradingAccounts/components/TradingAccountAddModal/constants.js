import { I18n } from 'react-redux-i18n';

module.exports = {
  attributeLabels: {
    name: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CREATE.NAME_LABEL'),
    mode: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CREATE.MODE_LABEL'),
    currency: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CREATE.CURRENCY_LABEL'),
    password: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CREATE.PASSWORD_LABEL'),
  },

  accountTypes: [{ mode: 'live', label: 'Live account' }],
};
