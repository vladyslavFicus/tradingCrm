import i18n from 'i18n-js';
import moment from 'moment';
import { toNumber } from 'lodash';
import humanizeDuration from 'humanize-duration';
import { COUNTRY_SPECIFIC_IDENTIFIER_TYPES, genders } from
  'routes/Clients/routes/Profile/routes/Client/components/PersonalInformationForm/constants';
import { departments, roles } from 'constants/operators';
import { kycStatuses } from 'constants/kycStatuses';
import { statuses, attributeLabels, reasons as blockReasons, unblockReasons } from 'constants/user';
import { documentsType, categories } from 'constants/files';
import { manualPaymentMethodsLabels, tradingStatuses, statuses as paymentStatuses } from 'constants/payment';
import { questionnaireLevel } from 'constants/questionnaire';

const humanizeDurationConfig = {
  language: 'en',
  largest: 2,
  conjunction: ' ',
  round: true,
};

const countryIdentifierTypesPath = 'PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.COUNTRY_SPECIFIC_IDENTIFIER_TYPES';
const departmentsPath = 'CONSTANTS.OPERATORS.DEPARTMENTS';
const kycStatusesPath = 'KYC_REQUESTS.STATUS';
const rolesPath = 'CONSTANTS.OPERATORS.ROLES';
const statusesPath = 'STATUSES_LABELS';
const documentTypesPath = 'FILES.DOCUMENTS_TYPE';
const documentCategoriesPath = 'FILES.CATEGORIES';
const manualPaymentMethodsPath = 'CONSTANTS.PAYMENT.PAYMENT_METHODS';
const tradingStatusesPath = 'FEED_ITEM.TRADING_STATUSES';
const questionnaireLevelPath = 'FEED_ITEM.QUESTIONNAIRE.LEVELS';
const paymentStatusesPath = 'COMMON.PAYMENT_STATUS';

const transformConstFromArr = (arr, path) => arr.reduce((acc, value) => ({
  ...acc,
  [value]: i18n.t(`${path}.${value}`),
}), {});

const transformConstFromObj = (obj, path) => Object.keys(obj).reduce((acc, key) => ({
  ...acc,
  [key]: i18n.t(`${path}.${key}`),
}), {});

const translateReasons = reasons => Object.keys(reasons).reduce((acc, key) => ({
  ...acc,
  [key]: i18n.t(key),
}), {});

const translateValue = (value) => {
  const detailsValues = {
    ...(transformConstFromArr(COUNTRY_SPECIFIC_IDENTIFIER_TYPES, countryIdentifierTypesPath)),
    ...(transformConstFromObj(statuses, statusesPath)),
    ...(transformConstFromObj(kycStatuses, kycStatusesPath)),
    ...(transformConstFromObj(departments, departmentsPath)),
    ...(transformConstFromObj(roles, rolesPath)),
    ...(transformConstFromObj(documentsType, documentTypesPath)),
    ...(transformConstFromObj(categories, documentCategoriesPath)),
    ...(transformConstFromObj(manualPaymentMethodsLabels, manualPaymentMethodsPath)),
    ...(transformConstFromObj(tradingStatuses, tradingStatusesPath)),
    ...(transformConstFromObj(questionnaireLevel, questionnaireLevelPath)),
    ...(transformConstFromObj(paymentStatuses, paymentStatusesPath)),
    ...(translateReasons(blockReasons)),
    ...(translateReasons(unblockReasons)),
    ...(genders),
    INDIVIDUAL_RETAIL: i18n.t('CLIENT_PROFILE.DETAILS.INDIVIDUAL_RETAIL'),
    INDIVIDUAL_PROFESSIONAL: i18n.t('CLIENT_PROFILE.DETAILS.INDIVIDUAL_PROFESSIONAL'),
    CORPORATE_RETAIL: i18n.t('CLIENT_PROFILE.DETAILS.CORPORATE_RETAIL'),
    CORPORATE_PROFESSIONAL: i18n.t('CLIENT_PROFILE.DETAILS.CORPORATE_PROFESSIONAL'),
    'Phone verified': i18n.t('PLAYER_PROFILE.PROFILE.VERIFIED_PHONE'),
    'E-mail verified': i18n.t('PLAYER_PROFILE.PROFILE.VERIFIED_EMAIL'),
  };
  // 'FEED_ITEM.OPERATOR_CREATION.INVITATION_SENT_SUCCESS',
  // 'FEED_ITEM.OPERATOR_CREATION.INVITATION_SENT_FAILURE',

  return detailsValues[value] || value;
};

const isValueBool = value => typeof value === 'boolean';

const isValueNumber = value => !Number.isNaN(toNumber(value));

const isValueMomentValid = (value) => {
  if (isValueBool(value)) {
    return false;
  }

  return isValueNumber(value)
    ? false
    : value;
};

const handleDate = (date) => {
  if (moment(date, ['YYYY-MM-DDTHH:mm:ss.SSS', 'YYYY-MM-DDTHH:mm:ss'], true).isValid()) {
    return moment.utc(new Date(date)).local().format('DD.MM.YYYY \\a\\t HH:mm:ss');
  }

  return 'Invalid date';
};

const transformBoolToString = bool => (bool === true
  ? 'true'
  : 'false');

const prepareCommonValue = (value) => {
  const date = isValueMomentValid(value)
    ? handleDate(value)
    : 'Invalid date';

  // If value is not a date then conduct it through next transform chain step
  if (date === 'Invalid date') {
    return isValueBool(value)
      ? transformBoolToString(value)
      : translateValue(value);
  }

  return date;
};

// Define that key is a custom and return corresponding value
export const prepareValue = (key, value) => {
  const customValues = {
    sessionDuration: humanizeDuration(value, humanizeDurationConfig),
  };

  return customValues[key] || prepareCommonValue(value);
};

export const renderLabel = label => attributeLabels[label] || label;
