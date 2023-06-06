import i18n from 'i18n-js';
import moment from 'moment';
import { toNumber, startCase } from 'lodash';
import humanizeDuration from 'humanize-duration';
import { departments, roles } from 'constants/operators';
import { kycStatuses } from 'constants/kycStatuses';
import rbac from 'constants/rbac';
import {
  genders,
  statuses,
  unblockReasons,
  reasons as blockReasons,
  COUNTRY_SPECIFIC_IDENTIFIER_TYPES,
} from 'constants/user';
import { orderTypes, orderStatuses } from 'routes/TE/constants';
import { documentsType, categories } from 'constants/files';
import {
  methodsLabels as paymentMethodsLabels,
  manualPaymentMethodsLabels,
  tradingStatuses,
  statuses as paymentStatuses,
} from 'constants/payment';
import { salesStatuses } from 'constants/salesStatuses';
import { retentionStatuses } from 'constants/retentionStatuses';

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
const tradingStatusesPath = 'FEED_ITEM.TRADING_STATUSES';
const paymentStatusesPath = 'COMMON.PAYMENT_STATUS';

const transformConstFromArr = (arr, path) => arr.reduce((acc, value) => ({
  ...acc,
  [value]: i18n.t(`${path}.${value}`),
}), {});

const transformConstFromObj = (obj, path) => Object.keys(obj).reduce((acc, key) => ({
  ...acc,
  [key]: i18n.t(`${path}.${key}`),
}), {});

const translateObject = obj => Object.keys(obj).reduce((acc, key) => ({
  ...acc,
  [key]: i18n.t(obj[key]),
}), {});

const rbacLocaleString = (section, permission) => i18n.t(
  `ROLES_AND_PERMISSIONS.SECTIONS.${section}.PERMISSIONS.${permission}`,
);

export const translateRbac = () => {
  const result = {};
  rbac.forEach(({ id: sId, permissions }) => permissions.forEach(({ id: pId, actions }) => {
    if (actions?.view?.action) {
      result[actions?.view?.action] = rbacLocaleString(sId, pId);
    }

    if (actions?.edit?.action) {
      result[actions?.edit?.action] = rbacLocaleString(sId, pId);
    }
  }));

  // additional permissions which not founded in regular permissions
  result['hierarchy.branch.getUserBranches'] = rbacLocaleString('hierarchy', 'list');
  result['operator-config.getFilterSetsList'] = rbacLocaleString('operator-config', 'list');
  result['operator-config.createFilterSet'] = rbacLocaleString('operator-config', 'create');
  result['operator-config.getFilterSet'] = rbacLocaleString('operator-config', 'read');
  result['operator-config.updateFilterSet'] = rbacLocaleString('operator-config', 'update');
  result['operator-config.deleteFilterSet'] = rbacLocaleString('operator-config', 'delete');
  result['operator-config.changeFilterSetFavouriteStatus'] = rbacLocaleString('operator-config', 'setFavourite');

  return result;
};

const rbacI18n = translateRbac();

const translateValue = (value) => {
  const detailsValues = {
    ...(transformConstFromArr(COUNTRY_SPECIFIC_IDENTIFIER_TYPES, countryIdentifierTypesPath)),
    ...(transformConstFromObj(statuses, statusesPath)),
    ...(transformConstFromObj(kycStatuses, kycStatusesPath)),
    ...(transformConstFromObj(departments, departmentsPath)),
    ...(transformConstFromObj(roles, rolesPath)),
    ...(transformConstFromObj(documentsType, documentTypesPath)),
    ...(transformConstFromObj(categories, documentCategoriesPath)),
    ...(transformConstFromObj(tradingStatuses, tradingStatusesPath)),
    ...(transformConstFromObj(paymentStatuses, paymentStatusesPath)),
    ...(translateObject(blockReasons)),
    ...(translateObject(unblockReasons)),
    ...(translateObject(salesStatuses)),
    ...(translateObject(retentionStatuses)),
    ...(translateObject(paymentMethodsLabels)),
    ...(translateObject(manualPaymentMethodsLabels)),
    ...(translateObject(genders)),
    ...(translateObject(orderTypes)),
    ...(translateObject(orderStatuses)),
    INDIVIDUAL_RETAIL: i18n.t('CLIENT_PROFILE.DETAILS.INDIVIDUAL_RETAIL'),
    INDIVIDUAL_PROFESSIONAL: i18n.t('CLIENT_PROFILE.DETAILS.INDIVIDUAL_PROFESSIONAL'),
    CORPORATE_RETAIL: i18n.t('CLIENT_PROFILE.DETAILS.CORPORATE_RETAIL'),
    CORPORATE_PROFESSIONAL: i18n.t('CLIENT_PROFILE.DETAILS.CORPORATE_PROFESSIONAL'),
    'Phone verified': i18n.t('PLAYER_PROFILE.PROFILE.VERIFIED_PHONE'),
    'E-mail verified': i18n.t('PLAYER_PROFILE.PROFILE.VERIFIED_EMAIL'),
    ...rbacI18n,
  };

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
  const supportedFormates = [
    'YYYY-MM-DDTHH:mm:ss.SSS',
    'YYYY-MM-DDTHH:mm:ss.SSSSSS',
    'YYYY-MM-DDTHH:mm:ss',
  ];

  if (moment(date, supportedFormates, true).isValid()) {
    return moment.utc(date).local().format('DD.MM.YYYY \\a\\t HH:mm:ss');
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
    inactiveSeconds: `Inactive ${value} seconds`,
  };

  return customValues[key] || prepareCommonValue(value);
};

export const renderLabel = label => i18n.t(`FEED_ITEM.${label}`, { defaultValue: startCase(label) });
