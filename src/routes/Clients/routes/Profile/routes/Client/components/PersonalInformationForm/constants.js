import I18n from 'i18n-js';

const genders = {
  FEMALE: I18n.t('COMMON.GENDERS.FEMALE'),
  MALE: I18n.t('COMMON.GENDERS.MALE'),
  UNDEFINED: I18n.t('COMMON.GENDERS.UNDEFINED'),
};

const attributeLabels = {
  firstName: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.FIRST_NAME'),
  lastName: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.LAST_NAME'),
  language: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.LANGUAGE'),
  birthDate: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.DATE_OF_BIRTH'),
  gender: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.GENDER'),
  identificationNumber: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.IDENTIFICATION_NUMBER'),
  passportNumber: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.PASSPORT_NUMBER'),
  expirationDate: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.PASSPORT_EXPARATION_DATE'),
  countryOfIssue: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.PASSPORT_ISSUE_COUNTRY'),
  passportIssueDate: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.PASSPORT_ISSUE_DATE'),
  countrySpecificIdentifier: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.COUNTRY_SPECIFIC_IDENTIFIER'),
  countrySpecificIdentifierType: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.COUNTRY_SPECIFIC_IDENTIFIER_TYPE'),
  timeZone: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.TIMEZONE'),
};

const timeZoneOffsets = [
  'UTC -12:00',
  'UTC -11:00',
  'UTC -10:00',
  'UTC -09:30',
  'UTC -09:00',
  'UTC -08:00',
  'UTC -07:00',
  'UTC -06:00',
  'UTC -05:00',
  'UTC -04:00',
  'UTC -03:30',
  'UTC -03:00',
  'UTC -02:00',
  'UTC -01:00',
  'UTC ±00:00',
  'UTC +01:00',
  'UTC +02:00',
  'UTC +03:00',
  'UTC +03:30',
  'UTC +04:00',
  'UTC +04:30',
  'UTC +05:00',
  'UTC +05:30',
  'UTC +05:45',
  'UTC +06:00',
  'UTC +06:30',
  'UTC +07:00',
  'UTC +08:00',
  'UTC +08:45',
  'UTC +09:00',
  'UTC +09:30',
  'UTC +10:00',
  'UTC +10:30',
  'UTC +11:00',
  'UTC +12:00',
  'UTC +12:45',
  'UTC +13:00',
  'UTC +14:00',
];

const COUNTRY_SPECIFIC_IDENTIFIER_TYPES = [
  'TEN_DSS_DIGIT_INVESTOR_SHARE',
  'ELEVEN_DIGIT_PERSONAL_ID',
  'BELGIAN_NATIONAL_NUMBER',
  'BULGARIAN_PERSONAL_NUMBER',
  'CONCAT',
  'ESTONIAN_PERSONAL_IDENTIFICATION_CODE',
  'FISCAL_CODE',
  'NATIONAL_IDENTIFICATION_NUMBER',
  'NATIONAL_IDENTIFICATION_NUMBER_COD_NUMERIC_PERSONAL',
  'NATIONAL_IDENTIFICATION_NUMBER_PESEL',
  'NATIONAL_PASSPORT_NUMBER',
  'PERSONAL_CODE_ASMENS_KODAS',
  'PERSONAL_CODE_PERSONAS_KODS',
  'PERSONAL_IDENTIFICATION_NUMBER',
  'PERSONAL_IDENTITY_CODE',
  'PERSONAL_IDENTITY_CODE_TEN_DIGITS_ALPHANUMERICAL_DDMMYYXXXX',
  'PERSONAL_IDENTITY_CODE_KENNITALA_ICELAND',
  'PERSONAL_IDENTITY_NUMBER',
  'PERSONAL_NUMBER',
  'TAX_IDENTIFICATION_NUMBER',
  'TAX_NUMBER',
  'UK_NATIONAL_INSURANCE_NUMBER',
];

export {
  genders,
  attributeLabels,
  timeZoneOffsets,
  COUNTRY_SPECIFIC_IDENTIFIER_TYPES,
};
