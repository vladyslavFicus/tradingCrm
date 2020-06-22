import React from 'react';
import keyMirror from 'keymirror';
import I18n from 'i18n-js';
import countries from 'utils/countryList';
import { statuses } from 'constants/operators';
import { statusesLabels, filterLabels } from 'constants/user';
import { salesStatuses } from 'constants/salesStatuses';
import { retentionStatuses } from 'constants/retentionStatuses';
import { warningValues, warningLabels } from 'constants/warnings';
import { kycStatusesLabels } from 'constants/kycStatuses';
import {
  fieldTypes,
  fieldClassNames,
  normalize,
  validators,
  parser,
} from 'components/ReduxForm/ReduxFieldsConstructor';

const acquisitionStatuses = [
  {
    value: 'RETENTION',
    label: 'COMMON.RETENTION',
  },
  {
    value: 'SALES',
    label: 'COMMON.SALES',
  },
];

const assignStatuses = [
  {
    value: 'ASSIGNED',
    label: 'COMMON.ASSIGN',
  },
  {
    value: 'UNASSIGNED',
    label: 'COMMON.UN_ASSIGN',
  },
];

const firstDepositStatuses = [
  {
    value: '0',
    label: 'COMMON.NO',
  },
  {
    value: '1',
    label: 'COMMON.YES',
  },
];

const activityStatuses = [
  {
    value: 'ONLINE',
    label: 'PROFILE.LAST_ACTIVITY.STATUS.ONLINE',
  },
  {
    value: 'OFFLINE',
    label: 'PROFILE.LAST_ACTIVITY.STATUS.OFFLINE',
  },
];

export const fieldNames = keyMirror({
  desks: null,
  teams: null,
  operators: null,
});

export default ({
  desks,
  teams,
  hierarchyLoading,
  operators,
  operatorsLoading,
  partners,
  partnersLoading,
  auth: {
    department,
    role,
  },
}) => [
  {
    type: fieldTypes.INPUT,
    name: 'searchByIdentifiers',
    label: filterLabels.searchValue,
    placeholder: 'COMMON.SEARCH_BY.CLIENT',
    inputAddon: <i className="icon icon-search" />,
    id: 'users-list-search-field',
    className: fieldClassNames.BIG,
  },
  {
    type: fieldTypes.INPUT,
    name: 'searchByAffiliateIdentifiers',
    label: filterLabels.searchValue,
    placeholder: 'COMMON.SEARCH_BY.AFFILIATE',
    inputAddon: <i className="icon icon-search" />,
    className: fieldClassNames.MEDIUM,
  },
  {
    type: fieldTypes.INPUT,
    name: 'migrationId',
    label: filterLabels.searchValue,
    placeholder: 'COMMON.SEARCH_BY.MIGRATION_ID',
    inputAddon: <i className="icon icon-search" />,
    className: fieldClassNames.MEDIUM,
  },
  {
    type: fieldTypes.SELECT,
    name: 'countries',
    label: filterLabels.country,
    placeholder: 'COMMON.SELECT_OPTION.ANY',
    multiple: true,
    className: fieldClassNames.MEDIUM,
    selectOptions: Object.keys(countries).map(value => ({
      value,
      label: countries[value],
    })),
    optionsWithoutI18n: true,
  },
  {
    type: fieldTypes.SELECT,
    name: 'activityStatus',
    label: filterLabels.activity,
    placeholder: 'COMMON.SELECT_OPTION.ANY',
    className: fieldClassNames.MEDIUM,
    selectOptions: activityStatuses,
    searchable: false,
  },
  {
    type: fieldTypes.SELECT,
    name: fieldNames.desks,
    label: filterLabels.desks,
    placeholder:
      !hierarchyLoading && desks.length === 0
        ? 'COMMON.SELECT_OPTION.NO_ITEMS'
        : 'COMMON.SELECT_OPTION.ANY',
    multiple: true,
    className: fieldClassNames.MEDIUM,
    customOnChange: true,
    disabled: hierarchyLoading || desks.length === 0,
    selectOptions: desks.map(({ uuid, name }) => ({
      value: uuid,
      label: name,
    })),
    optionsWithoutI18n: true,
  },
  {
    type: fieldTypes.SELECT,
    name: fieldNames.teams,
    label: filterLabels.teams,
    placeholder:
      !hierarchyLoading && teams.length === 0
        ? 'COMMON.SELECT_OPTION.NO_ITEMS'
        : 'COMMON.SELECT_OPTION.ANY',
    multiple: true,
    className: fieldClassNames.MEDIUM,
    customOnChange: true,
    disabled: hierarchyLoading || teams.length === 0,
    selectOptions: teams.map(({ uuid, name }) => ({
      value: uuid,
      label: name,
    })),
    optionsWithoutI18n: true,
  },
  {
    type: fieldTypes.SELECT,
    name: fieldNames.operators,
    label: filterLabels.operators,
    placeholder: 'COMMON.SELECT_OPTION.DEFAULT',
    className: fieldClassNames.MEDIUM,
    multiple: true,
    disabled: operatorsLoading || operators.length === 0,
    selectOptions: operators.map(({ uuid, fullName, operatorStatus }) => ({
      value: uuid,
      label: fullName,
      className:
        operatorStatus === statuses.INACTIVE
        || operatorStatus === statuses.CLOSED
          ? 'color-inactive'
          : '',
    })),
    optionsWithoutI18n: true,
  },
  {
    type: fieldTypes.SELECT,
    name: 'affiliateUuids',
    label: filterLabels.partners,
    placeholder: 'COMMON.SELECT_OPTION.DEFAULT',
    className: fieldClassNames.MEDIUM,
    multiple: true,
    disabled: partnersLoading || partners.length === 0,
    selectOptions: [{ uuid: 'NONE', fullName: I18n.t('COMMON.NONE') }, ...partners].map(({ uuid, fullName }) => ({
      value: uuid,
      label: fullName,
    })),
    optionsWithoutI18n: true,
  },
  {
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
  },
  {
    type: fieldTypes.SELECT,
    name: 'acquisitionStatus',
    label: filterLabels.acquisitionStatus,
    placeholder: 'COMMON.SELECT_OPTION.ANY',
    className: fieldClassNames.MEDIUM,
    selectOptions: acquisitionStatuses,
  },
  {
    type: fieldTypes.SELECT,
    name: 'salesStatuses',
    label: filterLabels.salesStatus,
    placeholder: 'COMMON.SELECT_OPTION.ANY',
    className: fieldClassNames.MEDIUM,
    multiple: true,
    selectOptions: Object.keys(salesStatuses).map(value => ({
      value,
      label: salesStatuses[value],
    })),
  },
  {
    type: fieldTypes.SELECT,
    name: 'retentionStatuses',
    label: filterLabels.retentionStatus,
    placeholder: 'COMMON.SELECT_OPTION.ANY',
    className: fieldClassNames.MEDIUM,
    multiple: true,
    selectOptions: Object.keys(retentionStatuses).map(value => ({
      value,
      label: retentionStatuses[value],
    })),
  },
  ...[
    ['ADMINISTRATION', 'CS'].includes(department)
    && ['ADMINISTRATION', 'HEAD_OF_DEPARTMENT'].includes(role) && {
      type: fieldTypes.SELECT,
      name: 'assignStatus',
      label: filterLabels.assignStatus,
      placeholder: 'COMMON.SELECT_OPTION.ANY',
      className: fieldClassNames.MEDIUM,
      selectOptions: assignStatuses,
    },
  ],
  {
    type: fieldTypes.SELECT,
    name: 'kycStatuses',
    label: filterLabels.kycStatuses,
    placeholder: 'COMMON.SELECT_OPTION.ANY',
    multiple: true,
    className: fieldClassNames.MEDIUM,
    selectOptions: Object.keys(kycStatusesLabels).map(value => ({
      value,
      label: kycStatusesLabels[value],
    })),
  },
  {
    type: fieldTypes.SELECT,
    name: 'firstTimeDeposit',
    label: filterLabels.firstDeposit,
    placeholder: 'COMMON.SELECT_OPTION.ANY',
    className: fieldClassNames.MEDIUM,
    selectOptions: firstDepositStatuses,
    searchable: false,
  },
  {
    type: fieldTypes.SELECT,
    name: 'warnings',
    label: filterLabels.warning,
    placeholder: 'COMMON.SELECT_OPTION.ANY',
    className: fieldClassNames.MEDIUM,
    selectOptions: Object.keys(warningValues).map(value => ({
      value,
      label: warningLabels[value],
    })),
    searchable: false,
  },
  {
    type: fieldTypes.RANGE,
    className: fieldClassNames.MEDIUM,
    label: filterLabels.balance,
    fields: [
      {
        type: fieldTypes.INPUT,
        inputType: 'number',
        name: 'balanceRange.from',
        normalize: normalize.FLOAT,
        placeholder: '0.00',
        step: '0.01',
        withoutI18n: true,
      },
      {
        type: fieldTypes.INPUT,
        inputType: 'number',
        name: 'balanceRange.to',
        normalize: normalize.FLOAT,
        placeholder: '0.00',
        step: '0.01',
        withoutI18n: true,
      },
    ],
  },
  {
    type: fieldTypes.RANGE,
    className: fieldClassNames.BIG,
    label: filterLabels.registrationDate,
    fields: [
      {
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
      },
      {
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
      },
    ],
  },
  {
    type: fieldTypes.RANGE,
    className: fieldClassNames.BIG,
    label: filterLabels.firstDepositDateRange,
    fields: [
      {
        type: fieldTypes.DATE,
        name: 'firstDepositDateRange.from',
        placeholder: 'COMMON.DATE_OPTIONS.START_DATE',
        closeOnSelect: false,
        dateValidator: {
          type: validators.START_DATE,
          fieldName: 'firstDepositDateRange.to',
        },
        withTime: true,
        timePresets: true,
      },
      {
        type: fieldTypes.DATE,
        name: 'firstDepositDateRange.to',
        placeholder: 'COMMON.DATE_OPTIONS.END_DATE',
        closeOnSelect: false,
        dateValidator: {
          type: validators.END_DATE,
          fieldName: 'firstDepositDateRange.from',
        },
        withTime: true,
        timePresets: true,
        isDateRangeEndValue: true,
      },
    ],
  },
  {
    type: fieldTypes.RANGE,
    className: fieldClassNames.BIG,
    label: filterLabels.firstNoteDate,
    fields: [
      {
        type: fieldTypes.DATE,
        name: 'firstNoteDateRange.from',
        placeholder: 'COMMON.DATE_OPTIONS.START_DATE',
        closeOnSelect: false,
        dateValidator: {
          type: validators.START_DATE,
          fieldName: 'firstNoteDateRange.to',
        },
        withTime: true,
        timePresets: true,
      },
      {
        type: fieldTypes.DATE,
        name: 'firstNoteDateRange.to',
        placeholder: 'COMMON.DATE_OPTIONS.END_DATE',
        closeOnSelect: false,
        dateValidator: {
          type: validators.END_DATE,
          fieldName: 'firstNoteDateRange.from',
        },
        withTime: true,
        timePresets: true,
        isDateRangeEndValue: true,
      },
    ],
  },
  {
    type: fieldTypes.RANGE,
    className: fieldClassNames.BIG,
    label: filterLabels.lastNoteDate,
    fields: [
      {
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
      },
      {
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
      },
    ],
  },
  {
    type: fieldTypes.RANGE,
    className: fieldClassNames.BIG,
    label: filterLabels.lastTradeDate,
    fields: [
      {
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
      },
      {
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
      },
    ],
  },
  {
    type: fieldTypes.RANGE,
    className: fieldClassNames.BIG,
    label: filterLabels.lastLoginDate,
    fields: [
      {
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
      },
      {
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
      },
    ],
  },
  {
    type: fieldTypes.RANGE,
    className: fieldClassNames.BIG,
    label: filterLabels.lastModificationDate,
    fields: [
      {
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
      },
      {
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
      },
    ],
  },
  {
    type: fieldTypes.INPUT,
    inputType: 'number',
    name: 'searchLimit',
    normalize: normalize.NUMBER,
    parse: parser.ONLY_POSITIVE,
    label: filterLabels.searchLimit,
    placeholder: 'COMMON.UNLIMITED',
    className: fieldClassNames.MEDIUM,
  },
];
