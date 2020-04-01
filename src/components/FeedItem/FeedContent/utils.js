import i18n from 'i18n-js';
import moment from 'moment';
import { toNumber } from 'lodash';
import humanizeDuration from 'humanize-duration';
import { COUNTRY_SPECIFIC_IDENTIFIER_TYPES } from 'routes/Clients/routes/Profile/routes/Client/components/constants';
import { genders } from 'routes/Clients/routes/Profile/routes/Client/components/PersonalForm';
import { riskStatuses } from 'routes/Clients/routes/Profile/components/RiskStatus/constants';
import { departments, roles } from 'constants/operators';
import { kycStatuses } from 'constants/kycStatuses';
import { statuses, attributeLabels } from 'constants/user';
import { documentsType } from 'constants/files';

const humanizeDurationConfig = {
  language: 'en',
  largest: 2,
  conjunction: ' ',
  round: true,
};

const countryIdentifierTypesPath = 'PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.COUNTRY_SPECIFIC_IDENTIFIER_TYPES';
const riskStatusesPath = 'CLIENT_PROFILE.RISKS.STATUS.STATUSES';
const departmentsPath = 'CONSTANTS.OPERATORS.DEPARTMENTS';
const kycStatusesPath = 'KYC_REQUESTS.STATUS';
const rolesPath = 'CONSTANTS.OPERATORS.ROLES';
const statusesPath = 'STATUSES_LABELS';
const filesPath = 'FILES.DOCUMENTS_TYPE';

const transformConstFromArr = (arr, path) => arr.reduce((acc, value) => ({
  ...acc,
  [value]: i18n.t(`${path}.${value}`),
}), {});

const transformConstFromObj = (obj, path) => Object.keys(obj).reduce((acc, key) => ({
  ...acc,
  [key]: i18n.t(`${path}.${key}`),
}), {});

const translateValue = (value) => {
  const detailsValues = {
    ...(transformConstFromArr(COUNTRY_SPECIFIC_IDENTIFIER_TYPES, countryIdentifierTypesPath)),
    ...(transformConstFromObj(statuses, statusesPath)),
    ...(transformConstFromObj(kycStatuses, kycStatusesPath)),
    ...(transformConstFromObj(departments, departmentsPath)),
    ...(transformConstFromObj(roles, rolesPath)),
    ...(transformConstFromObj(riskStatuses, riskStatusesPath)),
    ...(transformConstFromObj(documentsType, filesPath)),
    ...(genders()),
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

const transformBoolToString = bool => (bool === true
  ? 'true'
  : 'false');

const prepareCommonValue = (value) => {
  const date = isValueMomentValid(value)
    ? moment.utc(new Date(value)).local().format('DD.MM.YYYY \\a\\t HH:mm:ss')
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
