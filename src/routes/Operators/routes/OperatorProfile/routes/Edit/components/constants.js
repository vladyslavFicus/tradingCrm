import I18n from 'utils/fake-i18n';

const attributeLabels = {
  department: I18n.t('OPERATORS.PROFILE.DEPARTMENTS.LABELS.DEPARTMENT'),
  role: I18n.t('OPERATORS.PROFILE.DEPARTMENTS.LABELS.ROLE'),
};

const personalFormAttributeLabels = {
  firstName: I18n.t('OPERATORS.PROFILE.PERSONAL_FORM.LABELS.FIRST_NAME'),
  lastName: I18n.t('OPERATORS.PROFILE.PERSONAL_FORM.LABELS.LAST_NAME'),
  country: I18n.t('OPERATORS.PROFILE.PERSONAL_FORM.LABELS.COUNTRY'),
  phoneNumber: I18n.t('OPERATORS.PROFILE.PERSONAL_FORM.LABELS.PHONE'),
  email: I18n.t('COMMON.EMAIL'),
};

export {
  attributeLabels,
  personalFormAttributeLabels,
};

export default attributeLabels;
