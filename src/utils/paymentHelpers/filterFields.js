import React from 'react';
import {
  fieldTypes,
  fieldClassNames,
  normalize,
  validators,
} from 'components/ReduxForm/ReduxFieldsConstructor';
import { statuses as operatorsStasuses } from 'constants/operators';
import {
  aggregators,
  aggregatorsLabels,
  statuses,
  statusesLabels,
  tradingTypes,
  tradingTypesLabelsWithColor,
  withdrawStatuses,
  withdrawStatusesLabels,
} from 'constants/payment';
import formatLabel from 'utils/formatLabel';
import renderLabel from 'utils/renderLabel';
import countries from 'utils/countryList';
import { accountTypes } from 'constants/accountTypes';
import { warningValues, warningLabels } from 'constants/warnings';

const filterLabels = {
  searchParam: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.KEYWORD',
  countries: 'PROFILE.LIST.FILTERS.COUNTRY',
  paymentTypes: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.TYPE',
  paymentAggregator: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.PAYMENT_AGGREGATOR',
  paymentMethods: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.PAYMENT_METHOD',
  statuses: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.STATUSES',
  desks: 'PROFILE.LIST.FILTERS.DESKS',
  teams: 'PROFILE.LIST.FILTERS.TEAMS',
  originalAgents: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.ORIGINAL_AGENT',
  currency: 'COMMON.CURRENCY',
  amount: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.AMOUNT',
  creationTime: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.CREATION_DATE_RANGE',
  modificationTime: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.MODIFICATION_DATE_RANGE',
  statusChangedTime: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.STATUS_DATE_RANGE',
  accountType: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.ACCOUNT_TYPE',
  firstDeposit: 'PROFILE.LIST.FILTERS.FIRST_DEPOSIT',
  partners: 'PROFILE.LIST.FILTERS.AFFILIATES',
  warning: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.WARNING',
  withdrawStatus: 'COMMON.WITHDRAWAL_STATUS',
};

const filterPlaceholders = {
  searchParam: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_PLACEHOLDERS.KEYWORD',
  countries: 'COMMON.SELECT_OPTION.ANY',
  paymentTypes: 'COMMON.SELECT_OPTION.ANY',
  paymentAggregator: 'COMMON.SELECT_OPTION.ANY',
  paymentMethods: 'COMMON.SELECT_OPTION.ANY',
  statuses: 'COMMON.SELECT_OPTION.ANY',
  desks: 'COMMON.SELECT_OPTION.ANY',
  desksDisabled: 'COMMON.SELECT_OPTION.NO_ITEMS',
  teams: 'COMMON.SELECT_OPTION.ANY',
  teamsDisabled: 'COMMON.SELECT_OPTION.NO_ITEMS',
  originalAgents: 'COMMON.SELECT_OPTION.ANY',
  currency: 'COMMON.SELECT_OPTION.ANY',
  amountFrom: '0.0',
  amountTo: '0.0',
  creationTimeFrom: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.START_DATE',
  creationTimeTo: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.END_DATE',
  modificationTimeFrom: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.START_DATE',
  modificationTimeTo: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.END_DATE',
  statusChangedTimeFrom: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.START_DATE',
  statusChangedTimeTo: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.END_DATE',
  accountType: 'COMMON.SELECT_OPTION.ANY',
  firstDeposit: 'COMMON.SELECT_OPTION.ANY',
  warning: 'COMMON.SELECT_OPTION.ANY',
  withdrawStatus: 'COMMON.SELECT_OPTION.ANY',
};

const firstDepositStatuses = [{
  value: '1',
  label: 'COMMON.YES',
}, {
  value: '0',
  label: 'COMMON.NO',
}];

const currencyField = currencies => ({
  type: fieldTypes.SELECT,
  name: 'currency',
  label: filterLabels.currency,
  placeholder: filterPlaceholders.currency,
  className: fieldClassNames.MEDIUM,
  selectOptions: currencies.map(value => ({ value, label: value })),
  optionsWithoutI18n: true,
});

const countryField = {
  type: fieldTypes.SELECT,
  name: 'countries',
  label: filterLabels.countries,
  placeholder: filterPlaceholders.countries,
  multiple: true,
  className: fieldClassNames.MEDIUM,
  selectOptions: Object
    .keys(countries)
    .map(value => ({ value, label: countries[value] })),
  optionsWithoutI18n: true,
};

const partnersField = (partners, partnersLoading) => ({
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
});

export default ({
  currencies,
  desks,
  teams,
  disabledHierarchy,
  originalAgents,
  disabledOriginalAgents,
  paymentMethods,
  disabledPaymentMethods,
  partners,
  partnersLoading,
}, isClientView) => [
  {
    type: fieldTypes.INPUT,
    name: 'searchParam',
    label: filterLabels.searchParam,
    placeholder: filterPlaceholders.searchParam,
    inputAddon: <i className="icon icon-search" />,
    id: 'transactions-list-filters-search',
    className: fieldClassNames.BIG,
  },
  !isClientView && countryField,
  {
    type: fieldTypes.SELECT,
    name: 'paymentAggregator',
    label: filterLabels.paymentAggregator,
    placeholder: filterPlaceholders.paymentAggregator,
    className: fieldClassNames.MEDIUM,
    selectOptions: Object.keys(aggregators).map(value => ({
      value,
      label: aggregatorsLabels[value],
    })),
  },
  {
    type: fieldTypes.SELECT,
    name: 'paymentMethods',
    label: filterLabels.paymentMethods,
    placeholder: filterPlaceholders.paymentMethods,
    multiple: true,
    className: fieldClassNames.MEDIUM,
    disabled: disabledPaymentMethods,
    optionsWithoutI18n: true,
    selectOptions: paymentMethods.map(method => ({
      value: method,
      label: formatLabel(method),
    })),
  },
  {
    type: fieldTypes.SELECT,
    name: 'paymentTypes',
    label: filterLabels.paymentTypes,
    placeholder: filterPlaceholders.paymentTypes,
    multiple: true,
    className: fieldClassNames.MEDIUM,
    selectOptions: Object.keys(tradingTypes)
      .filter(i => tradingTypesLabelsWithColor[i])
      .map(type => ({
        value: type,
        label: tradingTypesLabelsWithColor[type].label,
      })),
  },
  {
    type: fieldTypes.SELECT,
    name: 'withdrawStatuses',
    label: filterLabels.withdrawStatus,
    placeholder: filterPlaceholders.withdrawStatus,
    multiple: true,
    className: fieldClassNames.MEDIUM,
    selectOptions: Object.keys(withdrawStatuses)
      .filter(i => withdrawStatusesLabels[i])
      .map(withdrawStatus => ({
        value: withdrawStatus,
        label: withdrawStatusesLabels[withdrawStatus],
      })),
  },
  {
    type: fieldTypes.SELECT,
    name: 'statuses',
    label: filterLabels.statuses,
    placeholder: filterPlaceholders.statuses,
    className: fieldClassNames.MEDIUM,
    multiple: true,
    selectOptions: Object.values(statuses).map(value => ({
      value,
      label: renderLabel(value, statusesLabels),
    })),
  },
  {
    type: fieldTypes.RANGE,
    className: fieldClassNames.BIG,
    label: filterLabels.statusChangedTime,
    fields: [
      {
        type: fieldTypes.DATE,
        name: 'statusChangedTimeFrom',
        placeholder: filterPlaceholders.statusChangedTimeFrom,
        dateValidator: {
          type: validators.START_DATE,
          fieldName: 'statusChangedTimeTo',
        },
        pickerClassName: 'left-side',
        withTime: true,
        timePresets: true,
        closeOnSelect: false,
      },
      {
        type: fieldTypes.DATE,
        name: 'statusChangedTimeTo',
        placeholder: filterPlaceholders.statusChangedTimeTo,
        dateValidator: {
          type: validators.END_DATE,
          fieldName: 'statusChangedTimeFrom',
        },
        withTime: true,
        timePresets: true,
        isDateRangeEndValue: true,
        closeOnSelect: false,
      },
    ],
  },
  {
    type: fieldTypes.SELECT,
    name: 'desks',
    label: filterLabels.desks,
    placeholder:
      !disabledHierarchy && desks.length === 0
        ? filterPlaceholders.desksDisabled
        : filterPlaceholders.desks,
    className: fieldClassNames.MEDIUM,
    multiple: true,
    customOnChange: true,
    disabled: disabledHierarchy || desks.length === 0,
    selectOptions: desks.map(({ uuid, name }) => ({
      value: uuid,
      label: name,
    })),
    optionsWithoutI18n: true,
  },
  {
    type: fieldTypes.SELECT,
    name: 'teams',
    label: filterLabels.teams,
    placeholder:
      !disabledHierarchy && teams.length === 0
        ? filterPlaceholders.teamsDisabled
        : filterPlaceholders.teams,
    className: fieldClassNames.MEDIUM,
    multiple: true,
    customOnChange: true,
    disabled: disabledHierarchy || teams.length === 0,
    selectOptions: teams.map(({ uuid, name }) => ({
      value: uuid,
      label: name,
    })),
    optionsWithoutI18n: true,
  },
  {
    type: fieldTypes.SELECT,
    name: 'agentIds',
    label: filterLabels.originalAgents,
    placeholder: filterPlaceholders.originalAgents,
    className: fieldClassNames.MEDIUM,
    disabled: disabledOriginalAgents,
    multiple: true,
    selectOptions: originalAgents.map(({ fullName, uuid, operatorStatus }) => ({
      value: uuid,
      label: fullName,
      className:
        operatorStatus === operatorsStasuses.INACTIVE
        || operatorStatus === operatorsStasuses.CLOSED
          ? 'color-inactive' : '',
    })),
    optionsWithoutI18n: true,
  },
  !isClientView && partnersField(partners, partnersLoading),
  !isClientView && currencyField(currencies),
  {
    type: fieldTypes.SELECT,
    name: 'accountType',
    label: filterLabels.accountType,
    placeholder: filterPlaceholders.accountType,
    className: fieldClassNames.SMALL,
    selectOptions: accountTypes,
    searchable: false,
  },
  {
    type: fieldTypes.SELECT,
    name: 'firstTimeDeposit',
    label: filterLabels.firstDeposit,
    placeholder: filterPlaceholders.firstDeposit,
    className: fieldClassNames.SMALL,
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
    label: filterLabels.amount,
    fields: [
      {
        type: fieldTypes.INPUT,
        name: 'amountFrom',
        inputType: 'number',
        step: '0.01',
        normalize: normalize.FLOAT,
        placeholder: filterPlaceholders.amountFrom,
        withoutI18n: true,
      },
      {
        type: fieldTypes.INPUT,
        name: 'amountTo',
        inputType: 'number',
        step: '0.01',
        normalize: normalize.FLOAT,
        placeholder: filterPlaceholders.amountTo,
        withoutI18n: true,
      },
    ],
  },
  {
    type: fieldTypes.RANGE,
    className: fieldClassNames.BIG,
    label: filterLabels.creationTime,
    fields: [
      {
        type: fieldTypes.DATE,
        name: 'creationTimeFrom',
        placeholder: filterPlaceholders.creationTimeFrom,
        dateValidator: {
          type: validators.START_DATE,
          fieldName: 'creationTimeTo',
        },
        pickerClassName: 'left-side',
        withTime: true,
        timePresets: true,
        closeOnSelect: false,
      },
      {
        type: fieldTypes.DATE,
        name: 'creationTimeTo',
        placeholder: filterPlaceholders.creationTimeTo,
        dateValidator: {
          type: validators.END_DATE,
          fieldName: 'creationTimeFrom',
        },
        withTime: true,
        timePresets: true,
        isDateRangeEndValue: true,
        closeOnSelect: false,
      },
    ],
  },
  {
    type: fieldTypes.RANGE,
    className: fieldClassNames.BIG,
    label: filterLabels.modificationTime,
    fields: [
      {
        type: fieldTypes.DATE,
        name: 'modificationTimeFrom',
        placeholder: filterPlaceholders.modificationTimeFrom,
        dateValidator: {
          type: validators.START_DATE,
          fieldName: 'modificationTimeTo',
        },
        pickerClassName: 'left-side',
        withTime: true,
        timePresets: true,
        closeOnSelect: false,
      },
      {
        type: fieldTypes.DATE,
        name: 'modificationTimeTo',
        placeholder: filterPlaceholders.modificationTimeTo,
        dateValidator: {
          type: validators.END_DATE,
          fieldName: 'modificationTimeFrom',
        },
        withTime: true,
        timePresets: true,
        isDateRangeEndValue: true,
        closeOnSelect: false,
      },
    ],
  },
];
