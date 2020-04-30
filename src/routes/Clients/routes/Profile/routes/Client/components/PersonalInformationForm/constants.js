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
  '-12:00',
  '-11:00',
  '-10:00',
  '-09:30',
  '-09:00',
  '-08:00',
  '-07:00',
  '-06:00',
  '-05:00',
  '-04:00',
  '-03:30',
  '-03:00',
  '-02:00',
  '-01:00',
  '±00:00',
  '+01:00',
  '+02:00',
  '+03:00',
  '+03:30',
  '+04:00',
  '+04:30',
  '+05:00',
  '+05:30',
  '+05:45',
  '+06:00',
  '+06:30',
  '+07:00',
  '+08:00',
  '+08:45',
  '+09:00',
  '+09:30',
  '+10:00',
  '+10:30',
  '+11:00',
  '+12:00',
  '+12:45',
  '+13:00',
  '+14:00',
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
