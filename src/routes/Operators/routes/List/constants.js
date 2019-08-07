import I18n from '../../../../utils/fake-i18n';

const attributeLabels = {
  keyword: I18n.t('OPERATORS.LIST.FILTER_FORM.LABEL.KEYWORD'),
  country: I18n.t('OPERATORS.LIST.FILTER_FORM.LABEL.COUNTRY'),
  status: I18n.t('OPERATORS.LIST.FILTER_FORM.LABEL.STATUS'),
  department: I18n.t('OPERATORS.LIST.FILTER_FORM.LABEL.DEPARTMENT'),
  role: I18n.t('OPERATORS.LIST.FILTER_FORM.LABEL.ROLE'),
  registrationDateFrom: I18n.t('OPERATORS.LIST.FILTER_FORM.LABEL.REGISTRATION_DATE_FROM'),
  registrationDateTo: I18n.t('OPERATORS.LIST.FILTER_FORM.LABEL.REGISTRATION_DATE_TO'),
};

export {
  attributeLabels,
};

export default attributeLabels;
