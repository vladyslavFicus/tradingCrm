import React from 'react';
import { uniq } from 'lodash';
import {
  fieldTypes,
  fieldClassNames,
  normalize,
  validators,
} from 'components/ReduxForm/ReduxFieldsConstructor';
import { statuses as operatorsStasuses } from 'constants/operators';
import {
  methods,
  methodsLabels,
  manualPaymentMethods,
  manualPaymentMethodsLabels,
  tradingTypes,
  tradingTypesLabelsWithColor,
  aggregators,
  aggregatorsLabels,
  statuses,
  statusesLabels,
} from 'constants/payment';
import renderLabel from 'utils/renderLabel';
import countries from 'utils/countryList';
import { accountTypes } from 'constants/accountTypes';

const attributeLabels = {
  keyword: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.KEYWORD',
  initiatorType: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.INITIATOR_TYPE',
  type: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.TYPE',
  statuses: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.STATUSES',
  paymentMethod: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.PAYMENT_METHOD',
  paymentAggregator: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.PAYMENT_AGGREGATOR',
  startDate: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.START_DATE',
  endDate: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.END_DATE',
  amountLowerBound: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.AMOUNT_FROM',
  amountUpperBound: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.AMOUNT_TO',
  amount: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.AMOUNT',
  creationDateRange: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.CREATION_DATE_RANGE',
  modificationDateRange: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.MODIFICATION_DATE_RANGE',
  originalAgents: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.ORIGINAL_AGENT',
  country: 'COUNTRIES.GRID.LABEL.COUNTRY',
  accountType: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.ACCOUNT_TYPE',
};

const attributePlaceholders = {
  keyword: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_PLACEHOLDERS.KEYWORD',
};

const countryField = {
  type: fieldTypes.SELECT,
  name: 'countries',
  label: attributeLabels.country,
  placeholder: 'COMMON.SELECT_OPTION.ANY',
  multiple: true,
  className: fieldClassNames.MEDIUM,
  withoutI18n: true,
  selectOptions: Object
    .keys(countries)
    .map(key => ({ value: key, label: countries[key] })),
  optionsWithoutI18n: true,
};

const currencyField = currencies => ({
  type: fieldTypes.SELECT,
  name: 'currency',
  label: 'COMMON.CURRENCY',
  placeholder: 'COMMON.SELECT_OPTION.ANY',
  className: fieldClassNames.MEDIUM,
  selectOptions: currencies.map(value => ({
    value,
    label: value,
  })),
  optionsWithoutI18n: true,
});

export default (
  {
    originalAgents,
    disabledOriginalAgentField,
    currencies,
  },
  isClientView,
) => [{
  type: fieldTypes.INPUT,
  name: 'searchParam',
  label: attributeLabels.keyword,
  placeholder: attributePlaceholders.keyword,
  inputAddon: <i className="icon icon-search" />,
  id: 'transactions-list-filters-search',
  className: fieldClassNames.BIG,
},
!isClientView && countryField,
{
  type: fieldTypes.SELECT,
  name: 'paymentTypes',
  label: attributeLabels.type,
  placeholder: 'COMMON.SELECT_OPTION.ANY',
  multiple: true,
  className: fieldClassNames.MEDIUM,
  selectOptions: Object
    .keys(tradingTypes)
    .filter(i => tradingTypesLabelsWithColor[i])
    .map(type => ({
      value: type,
      label: tradingTypesLabelsWithColor[type].label,
    })),
}, {
  type: fieldTypes.SELECT,
  name: 'paymentAggregator',
  label: attributeLabels.paymentAggregator,
  placeholder: 'COMMON.SELECT_OPTION.ANY',
  className: fieldClassNames.MEDIUM,
  selectOptions: [aggregators.CASHIER, aggregators.MANUAL]
    .map(value => ({
      value, label: aggregatorsLabels[value],
    })),
}, {
  type: fieldTypes.SELECT,
  name: 'paymentMethods',
  label: attributeLabels.paymentMethod,
  multiple: true,
  placeholder: 'COMMON.SELECT_OPTION.ANY',
  className: fieldClassNames.MEDIUM,
  selectOptions: uniq([...Object.keys(methods), ...Object.keys(manualPaymentMethods)])
    .map((method) => {
      let label = method;

      if (methodsLabels[method]) {
        label = methodsLabels[method];
      }

      if (manualPaymentMethodsLabels[method]) {
        label = manualPaymentMethodsLabels[method];
      }

      return ({
        value: method,
        label,
      });
    })
    .sort(({ value: a }, { value: b }) => (a > b ? 1 : -1)),
}, {
  type: fieldTypes.SELECT,
  name: 'statuses',
  label: attributeLabels.statuses,
  placeholder: 'COMMON.SELECT_OPTION.ANY',
  className: fieldClassNames.MEDIUM,
  multiple: true,
  selectOptions: Object
    .values(statuses)
    .map(value => ({ value, label: renderLabel(value, statusesLabels) })),
}, {
  type: fieldTypes.SELECT,
  name: 'agentIds',
  label: attributeLabels.originalAgents,
  placeholder: 'COMMON.SELECT_OPTION.ANY',
  className: fieldClassNames.MEDIUM,
  disabled: disabledOriginalAgentField,
  multiple: true,
  selectOptions: originalAgents.map(({ fullName, uuid, operatorStatus }) => ({
    value: uuid,
    label: fullName,
    className:
      operatorStatus === operatorsStasuses.INACTIVE || operatorStatus === operatorsStasuses.CLOSED
        ? 'color-inactive' : '',
  })),
  optionsWithoutI18n: true,
},
!isClientView && currencyField(currencies),
{
  type: fieldTypes.RANGE,
  className: fieldClassNames.MEDIUM,
  label: attributeLabels.amount,
  fields: [{
    type: fieldTypes.INPUT,
    name: 'amountFrom',
    inputType: 'number',
    normalize: normalize.FLOAT,
    placeholder: '0.0',
    withoutI18n: true,
  }, {
    type: fieldTypes.INPUT,
    name: 'amountTo',
    inputType: 'number',
    normalize: normalize.FLOAT,
    placeholder: '0.0',
    withoutI18n: true,
  }],
}, {
  type: fieldTypes.RANGE,
  className: fieldClassNames.BIG,
  label: attributeLabels.creationDateRange,
  fields: [{
    type: fieldTypes.DATE,
    name: 'creationTimeFrom',
    placeholder: attributeLabels.startDate,
    dateValidator: {
      type: validators.START_DATE,
      fieldName: 'creationTimeTo',
    },
    pickerClassName: 'left-side',
    withTime: true,
    timePresets: true,
    closeOnSelect: false,
  }, {
    type: fieldTypes.DATE,
    name: 'creationTimeTo',
    placeholder: attributeLabels.endDate,
    dateValidator: {
      type: validators.END_DATE,
      fieldName: 'creationTimeFrom',
    },
    withTime: true,
    timePresets: true,
    isDateRangeEndValue: true,
    closeOnSelect: false,
  }],
}, {
  type: fieldTypes.RANGE,
  className: fieldClassNames.BIG,
  label: attributeLabels.modificationDateRange,
  fields: [{
    type: fieldTypes.DATE,
    name: 'modificationTimeFrom',
    placeholder: attributeLabels.startDate,
    dateValidator: {
      type: validators.START_DATE,
      fieldName: 'modificationTimeTo',
    },
    pickerClassName: 'left-side',
    withTime: true,
    timePresets: true,
    closeOnSelect: false,
  }, {
    type: fieldTypes.DATE,
    name: 'modificationTimeTo',
    placeholder: attributeLabels.endDate,
    dateValidator: {
      type: validators.END_DATE,
      fieldName: 'modificationTimeFrom',
    },
    withTime: true,
    timePresets: true,
    isDateRangeEndValue: true,
    closeOnSelect: false,
  }],
}, {
  type: fieldTypes.SELECT,
  name: 'accountType',
  label: attributeLabels.accountType,
  placeholder: 'COMMON.SELECT_OPTION.ANY',
  className: fieldClassNames.SMALL,
  selectOptions: accountTypes.map(({ label, value }) => ({ value, label })),
}];
