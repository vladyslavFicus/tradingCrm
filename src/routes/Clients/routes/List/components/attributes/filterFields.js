import React from 'react';
import keyMirror from 'keymirror';
import countries from 'utils/countryList';
import { statuses } from 'constants/operators';
import { statusesLabels, filterLabels } from '../../../../../../constants/user';
import { salesStatuses } from '../../../../../../constants/salesStatuses';
import { retentionStatuses } from '../../../../../../constants/retentionStatuses';
import {
  fieldTypes,
  fieldClassNames,
  normalize,
  validators,
  parser,
} from '../../../../../../components/ReduxForm/ReduxFieldsConstructor';

const acquisitionStatuses = [{
  value: 'RETENTION',
  label: 'COMMON.RETENTION',
}, {
  value: 'SALES',
  label: 'COMMON.SALES',
}];

const assignStatuses = [{
  value: 'ASSIGNED',
  label: 'COMMON.ASSIGN',
}, {
  value: 'UNASSIGNED',
  label: 'COMMON.UN_ASSIGN',
}];

const kycStatuses = [
  {
    value: 'APPROVED',
    label: 'KYC_REQUESTS.STATUS.APPROVED',
  },
  {
    value: 'APPROVED_AWAITING_REVIEW',
    label: 'KYC_REQUESTS.STATUS.APPROVED_AWAITING_REVIEW',
  },
  {
    value: 'AWAITING_REVIEW',
    label: 'KYC_REQUESTS.STATUS.AWAITING_REVIEW',
  },
  {
    value: 'FLAGGED_NON_COMPLIANT',
    label: 'KYC_REQUESTS.STATUS.FLAGGED_NON_COMPLIANT',
  },
  {
    value: 'NO_KYC',
    label: 'KYC_REQUESTS.STATUS.NO_KYC',
  },
  {
    value: 'PARTIAL',
    label: 'KYC_REQUESTS.STATUS.PARTIAL',
  },
  {
    value: 'PARTIAL_KYC_CAN_TRADE',
    label: 'KYC_REQUESTS.STATUS.PARTIAL_KYC_CAN_TRADE',
  },
  {
    value: 'PENDING',
    label: 'KYC_REQUESTS.STATUS.PENDING',
  },
  {
    value: 'PRIOR_TO_REFUND',
    label: 'KYC_REQUESTS.STATUS.PRIOR_TO_REFUND',
  },
  {
    value: 'REFUNDED_NON_COMPLIANT',
    label: 'KYC_REQUESTS.STATUS.REFUNDED_NON_COMPLIANT',
  },
  {
    value: 'REJECTED',
    label: 'KYC_REQUESTS.STATUS.REJECTED',
  },
  {
    value: 'RISK',
    label: 'KYC_REQUESTS.STATUS.RISK',
  },
];

const firstDepositStatuses = [{
  value: '0',
  label: 'COMMON.NO',
}, {
  value: '1',
  label: 'COMMON.YES',
}];

const questionnaire = [
  {
    value: 'APPROVED',
    label: 'QUESTIONNAIRE.APPROVED',
  },
  {
    value: 'REJECTED',
    label: 'QUESTIONNAIRE.REJECTED',
  },
  {
    value: 'NO_QUESTIONNAIRE',
    label: 'QUESTIONNAIRE.NO_QUESTIONNAIRE',
  },
];

export const fieldNames = keyMirror({
  desks: null,
  teams: null,
  operators: null,
});

export default (
  desks,
  teams,
  branchesLoading,
  operators,
  operatorsLoading,
  partners,
  partnersLoading,
) => [{
  type: fieldTypes.INPUT,
  name: 'searchByIdentifiers',
  label: filterLabels.searchValue,
  placeholder: 'COMMON.SEARCH_BY.CLIENT',
  inputAddon: <i className="icon icon-search" />,
  id: 'users-list-search-field',
  className: fieldClassNames.BIG,
}, {
  type: fieldTypes.INPUT,
  name: 'searchByAffiliateIdentifiers',
  label: filterLabels.searchValue,
  placeholder: 'COMMON.SEARCH_BY.AFFILIATE',
  inputAddon: <i className="icon icon-search" />,
  className: fieldClassNames.MEDIUM,
}, {
  type: fieldTypes.INPUT,
  name: 'migrationId',
  label: filterLabels.searchValue,
  placeholder: 'COMMON.SEARCH_BY.MIGRATION_ID',
  inputAddon: <i className="icon icon-search" />,
  className: fieldClassNames.MEDIUM,
}, {
  type: fieldTypes.SELECT,
  name: 'countries',
  label: filterLabels.country,
  placeholder: 'COMMON.SELECT_OPTION.ANY',
  multiple: true,
  className: fieldClassNames.MEDIUM,
  selectOptions: Object
    .keys(countries)
    .map(value => ({ value, label: countries[value] })),
  optionsWithoutI18n: true,
}, {
  type: fieldTypes.SELECT,
  name: fieldNames.desks,
  label: filterLabels.desks,
  placeholder: (!branchesLoading && desks.length === 0)
    ? 'COMMON.SELECT_OPTION.NO_ITEMS'
    : 'COMMON.SELECT_OPTION.ANY',
  multiple: true,
  className: fieldClassNames.MEDIUM,
  customOnChange: true,
  disabled: branchesLoading || desks.length === 0,
  selectOptions: desks.map(({ uuid, name }) => ({
    value: uuid,
    label: name,
  })),
  optionsWithoutI18n: true,
}, {
  type: fieldTypes.SELECT,
  name: fieldNames.teams,
  label: filterLabels.teams,
  placeholder: (!branchesLoading && teams.length === 0)
    ? 'COMMON.SELECT_OPTION.NO_ITEMS'
    : 'COMMON.SELECT_OPTION.ANY',
  multiple: true,
  className: fieldClassNames.MEDIUM,
  customOnChange: true,
  disabled: branchesLoading || teams.length === 0,
  selectOptions: teams.map(({ uuid, name }) => ({
    value: uuid,
    label: name,
  })),
  optionsWithoutI18n: true,
}, {
  type: fieldTypes.SELECT,
  name: fieldNames.operators,
  label: filterLabels.operators,
  placeholder: 'COMMON.SELECT_OPTION.DEFAULT',
  className: fieldClassNames.MEDIUM,
  multiple: true,
  disabled: operatorsLoading || operators.length === 0,
  selectOptions: operators.map(({ uuid, fullName, operatorStatus }) => (
    {
      value: uuid,
      label: fullName,
      className: operatorStatus === statuses.INACTIVE || operatorStatus === statuses.CLOSED ? 'color-inactive' : '',
    }
  )),
  optionsWithoutI18n: true,
}, {
  type: fieldTypes.SELECT,
  name: 'affiliateUuids',
  label: filterLabels.partners,
  placeholder: 'COMMON.SELECT_OPTION.DEFAULT',
  className: fieldClassNames.MEDIUM,
  multiple: true,
  disabled: partnersLoading || partners.length === 0,
  selectOptions: partners.map(({ uuid, fullName }) => (
    {
      value: uuid,
      label: fullName,
    }
  )),
  optionsWithoutI18n: true,
}, {
  type: fieldTypes.SELECT,
  name: 'statuses',
  label: filterLabels.status,
  placeholder: 'COMMON.SELECT_OPTION.ANY',
  className: fieldClassNames.MEDIUM,
  multiple: true,
  selectOptions: Object.keys(statusesLabels).map(value => ({
    value,
    label: statusesLabels[value],
  })),
}, {
  type: fieldTypes.SELECT,
  name: 'acquisitionStatus',
  label: filterLabels.acquisitionStatus,
  placeholder: 'COMMON.SELECT_OPTION.ANY',
  className: fieldClassNames.MEDIUM,
  selectOptions: acquisitionStatuses.map(({ value, label }) => ({ value, label })),
}, {
  type: fieldTypes.SELECT,
  name: 'salesStatuses',
  label: filterLabels.salesStatus,
  placeholder: 'COMMON.SELECT_OPTION.ANY',
  className: fieldClassNames.MEDIUM,
  multiple: true,
  selectOptions: Object
    .keys(salesStatuses)
    .map(value => ({
      value,
      label: salesStatuses[value],
    })),
}, {
  type: fieldTypes.SELECT,
  name: 'retentionStatuses',
  label: filterLabels.retentionStatus,
  placeholder: 'COMMON.SELECT_OPTION.ANY',
  className: fieldClassNames.MEDIUM,
  multiple: true,
  selectOptions: Object
    .keys(retentionStatuses)
    .map(value => ({
      value,
      label: retentionStatuses[value],
    })),
}, {
  type: fieldTypes.SELECT,
  name: 'assignStatus',
  label: filterLabels.assignStatus,
  placeholder: 'COMMON.SELECT_OPTION.ANY',
  className: fieldClassNames.MEDIUM,
  selectOptions: assignStatuses.map(({ value, label }) => ({ value, label })),
}, {
  type: fieldTypes.SELECT,
  name: 'kycStatuses',
  label: filterLabels.kycStatuses,
  placeholder: 'COMMON.SELECT_OPTION.ANY',
  multiple: true,
  className: fieldClassNames.MEDIUM,
  selectOptions: kycStatuses.map(({ value, label }) => ({ value, label })),
}, {
  type: fieldTypes.SELECT,
  name: 'firstTimeDeposit',
  label: filterLabels.firstDeposit,
  placeholder: 'COMMON.SELECT_OPTION.ANY',
  className: fieldClassNames.MEDIUM,
  selectOptions: firstDepositStatuses.map(({ value, label }) => ({ value, label })),
}, {
  type: fieldTypes.SELECT,
  name: 'questionnaireStatus',
  label: filterLabels.questionnaire,
  placeholder: 'COMMON.SELECT_OPTION.ANY',
  className: fieldClassNames.MEDIUM,
  selectOptions: questionnaire,
}, {
  type: fieldTypes.RANGE,
  className: fieldClassNames.MEDIUM,
  label: filterLabels.balance,
  fields: [{
    type: fieldTypes.INPUT,
    inputType: 'number',
    name: 'balanceRange.from',
    normalize: normalize.FLOAT,
    placeholder: '0.00',
    step: '0.01',
    withoutI18n: true,
  }, {
    type: fieldTypes.INPUT,
    inputType: 'number',
    name: 'balanceRange.to',
    normalize: normalize.FLOAT,
    placeholder: '0.00',
    step: '0.01',
    withoutI18n: true,
  }],
}, {
  type: fieldTypes.RANGE,
  className: fieldClassNames.BIG,
  label: filterLabels.registrationDate,
  fields: [{
    type: fieldTypes.DATE,
    name: 'registrationDateRange.from',
    placeholder: 'COMMON.DATE_OPTIONS.START_DATE',
    closeOnSelect: false,
    dateValidator: {
      type: validators.START_DATE,
      fieldName: 'registrationDateTo',
    },
    withTime: true,
    timePresets: true,
  }, {
    type: fieldTypes.DATE,
    name: 'registrationDateRange.to',
    placeholder: 'COMMON.DATE_OPTIONS.END_DATE',
    closeOnSelect: false,
    dateValidator: {
      type: validators.END_DATE,
      fieldName: 'registrationDateFrom',
    },
    withTime: true,
    timePresets: true,
    isDateRangeEndValue: true,
  }],
}, {
  type: fieldTypes.RANGE,
  className: fieldClassNames.BIG,
  label: filterLabels.lastNoteDate,
  fields: [{
    type: fieldTypes.DATE,
    name: 'lastNoteDateRange.from',
    placeholder: 'COMMON.DATE_OPTIONS.START_DATE',
    closeOnSelect: false,
    dateValidator: {
      type: validators.START_DATE,
      fieldName: 'lastNoteDateRange.to',
    },
    withTime: true,
    timePresets: true,
  }, {
    type: fieldTypes.DATE,
    name: 'lastNoteDateRange.to',
    placeholder: 'COMMON.DATE_OPTIONS.END_DATE',
    closeOnSelect: false,
    dateValidator: {
      type: validators.END_DATE,
      fieldName: 'lastNoteDateRange.from',
    },
    withTime: true,
    timePresets: true,
    isDateRangeEndValue: true,
  }],
}, {
  type: fieldTypes.RANGE,
  className: fieldClassNames.BIG,
  label: filterLabels.lastTradeDate,
  fields: [{
    type: fieldTypes.DATE,
    name: 'lastTradeDateRange.from',
    placeholder: 'COMMON.DATE_OPTIONS.START_DATE',
    closeOnSelect: false,
    dateValidator: {
      type: validators.START_DATE,
      fieldName: 'lastTradeDateRange.to',
    },
    withTime: true,
    timePresets: true,
  }, {
    type: fieldTypes.DATE,
    name: 'lastTradeDateRange.to',
    placeholder: 'COMMON.DATE_OPTIONS.END_DATE',
    closeOnSelect: false,
    dateValidator: {
      type: validators.END_DATE,
      fieldName: 'lastTradeDateRange.from',
    },
    withTime: true,
    timePresets: true,
    isDateRangeEndValue: true,
  }],
}, {
  type: fieldTypes.RANGE,
  className: fieldClassNames.BIG,
  label: filterLabels.lastLoginDate,
  fields: [{
    type: fieldTypes.DATE,
    name: 'lastLoginDateRange.from',
    placeholder: 'COMMON.DATE_OPTIONS.START_DATE',
    closeOnSelect: false,
    dateValidator: {
      type: validators.START_DATE,
      fieldName: 'lastLoginDateRange.to',
    },
    withTime: true,
    timePresets: true,
  }, {
    type: fieldTypes.DATE,
    name: 'lastLoginDateRange.to',
    placeholder: 'COMMON.DATE_OPTIONS.END_DATE',
    closeOnSelect: false,
    dateValidator: {
      type: validators.END_DATE,
      fieldName: 'lastLoginDateRange.from',
    },
    withTime: true,
    timePresets: true,
    isDateRangeEndValue: true,
  }],
}, {
  type: fieldTypes.RANGE,
  className: fieldClassNames.BIG,
  label: filterLabels.lastModificationDate,
  fields: [{
    type: fieldTypes.DATE,
    name: 'lastModificationDateRange.from',
    placeholder: 'COMMON.DATE_OPTIONS.START_DATE',
    closeOnSelect: false,
    dateValidator: {
      type: validators.START_DATE,
      fieldName: 'lastModificationDateRange.to',
    },
    withTime: true,
    timePresets: true,
  }, {
    type: fieldTypes.DATE,
    name: 'lastModificationDateRange.to',
    placeholder: 'COMMON.DATE_OPTIONS.END_DATE',
    closeOnSelect: false,
    dateValidator: {
      type: validators.END_DATE,
      fieldName: 'lastModificationDateRange.from',
    },
    withTime: true,
    timePresets: true,
    isDateRangeEndValue: true,
  }],
}, {
  type: fieldTypes.INPUT,
  inputType: 'number',
  name: 'searchLimit',
  normalize: normalize.NUMBER,
  parse: parser.ONLY_POSITIVE,
  label: filterLabels.searchLimit,
  placeholder: 'COMMON.UNLIMITED',
  className: fieldClassNames.MEDIUM,
}];
