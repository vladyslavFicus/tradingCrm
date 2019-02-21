import I18n from '../../../../../../utils/fake-i18n';

export const genders = ['MALE', 'FEMALE'];

export const AGE_YEARS_CONSTRAINT = 18;

export const attributeLabels = {
  name: I18n.t('LEAD_PROFILE.PERSONAL.LABEL.FIRST_NAME'),
  surname: I18n.t('LEAD_PROFILE.PERSONAL.LABEL.LAST_NAME'),
  birthDate: I18n.t('LEAD_PROFILE.PERSONAL.LABEL.DATE_OF_BIRTH'),
  gender: I18n.t('LEAD_PROFILE.PERSONAL.LABEL.GENDER'),
  country: I18n.t('LEAD_PROFILE.PERSONAL.LABEL.COUNTRY'),
  city: I18n.t('LEAD_PROFILE.PERSONAL.LABEL.CITY'),
  phone: I18n.t('LEAD_PROFILE.PERSONAL.LABEL.PHONE'),
  phoneCode: I18n.t('LEAD_PROFILE.PERSONAL.LABEL.PHONE_CODE'),
  mobile: I18n.t('LEAD_PROFILE.PERSONAL.LABEL.MOBILE'),
  mobileCode: I18n.t('LEAD_PROFILE.PERSONAL.LABEL.MOBILE_CODE'),
  email: I18n.t('COMMON.EMAIL'),
};
