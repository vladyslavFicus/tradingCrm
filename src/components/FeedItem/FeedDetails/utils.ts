import I18n from 'i18n-js';
import moment from 'moment';
import { startCase } from 'lodash';
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

const SUPPORTED_DATE_FORMATES = [
  'YYYY-MM-DDTHH:mm:ss.SSS',
  'YYYY-MM-DDTHH:mm:ss.SSSSSS',
  'YYYY-MM-DDTHH:mm:ss',
];

const HUMANIZE_DURATION_CONFIG = {
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

const transformConstFromArr = (arr: Array<string>, path: string) => arr.reduce((acc, value) => ({
  ...acc,
  [value]: I18n.t(`${path}.${value}`),
}), {});

const transformConstFromObj = (obj: Record<string, string>, path: string) => Object.keys(obj).reduce((acc, key) => ({
  ...acc,
  [key]: I18n.t(`${path}.${key}`),
}), {});

const translateObject = (obj: Record<string, string>) => Object.keys(obj).reduce((acc, key) => ({
  ...acc,
  [key]: I18n.t(obj[key]),
}), {});

const rbacLocaleString = (section: string, permission: string) => I18n.t(
  `ROLES_AND_PERMISSIONS.SECTIONS.${section}.PERMISSIONS.${permission}`,
);

export const translateRbac = () => {
  const result: Record<string, string> = {};
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

const translateValue = (value: any) => {
  const detailsValues: Record<string, string> = {
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
    INDIVIDUAL_RETAIL: I18n.t('CLIENT_PROFILE.DETAILS.INDIVIDUAL_RETAIL'),
    INDIVIDUAL_PROFESSIONAL: I18n.t('CLIENT_PROFILE.DETAILS.INDIVIDUAL_PROFESSIONAL'),
    CORPORATE_RETAIL: I18n.t('CLIENT_PROFILE.DETAILS.CORPORATE_RETAIL'),
    CORPORATE_PROFESSIONAL: I18n.t('CLIENT_PROFILE.DETAILS.CORPORATE_PROFESSIONAL'),
    'Phone verified': I18n.t('PLAYER_PROFILE.PROFILE.VERIFIED_PHONE'),
    'E-mail verified': I18n.t('PLAYER_PROFILE.PROFILE.VERIFIED_EMAIL'),
    ...rbacI18n,
  };

  return detailsValues[value] || value?.toString();
};

// Define that key is a custom and return corresponding value
export const renderValue = (label: string, value: any) => {
  if (moment(value, SUPPORTED_DATE_FORMATES, true).isValid()) {
    return moment.utc(value).local().format('DD.MM.YYYY \\a\\t HH:mm:ss');
  }

  switch (label) {
    case 'sessionDuration':
      return humanizeDuration(value, HUMANIZE_DURATION_CONFIG);
    case 'amount':
      return I18n.toCurrency(value, { unit: '' });
    default:
      return translateValue(value);
  }
};

export const renderLabel = (label: string) => I18n.t(`FEED_ITEM.${label}`, { defaultValue: startCase(label) });
