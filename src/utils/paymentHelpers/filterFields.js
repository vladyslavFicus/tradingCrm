import React from 'react';
import { uniq } from 'lodash';
import {
  fieldTypes,
  fieldClassNames,
  normalize,
  validators,
} from 'components/ReduxForm/ReduxFieldsConstructor';
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
import I18n from '../fake-i18n';

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
  name: 'country',
  label: I18n.t(attributeLabels.country),
  placeholder: I18n.t('COMMON.SELECT_OPTION.ANY'),
  className: fieldClassNames.MEDIUM,
  selectOptions: Object
    .keys(countries)
    .map(key => ({ value: key, label: countries[key] })),
};

const currencyField = currencies => ({
  type: fieldTypes.SELECT,
  name: 'currency',
  label: I18n.t('COMMON.CURRENCY'),
  placeholder: I18n.t('COMMON.SELECT_OPTION.ANY'),
  className: fieldClassNames.MEDIUM,
  selectOptions: currencies.map(value => ({ value, label: value })),
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
  label: I18n.t(attributeLabels.keyword),
  placeholder: I18n.t(attributePlaceholders.keyword),
  inputAddon: <i className="icon icon-search" />,
  id: 'transactions-list-filters-search',
  className: fieldClassNames.BIG,
},
!isClientView && countryField,
{
  type: fieldTypes.SELECT,
  name: 'paymentTypes',
  label: I18n.t(attributeLabels.type),
  placeholder: I18n.t('COMMON.SELECT_OPTION.ANY'),
  multiple: true,
  className: fieldClassNames.MEDIUM,
  selectOptions: Object
    .keys(tradingTypes)
    .filter(i => tradingTypesLabelsWithColor[i])
    .map(type => ({ value: type, label: I18n.t(tradingTypesLabelsWithColor[type].label) })),
}, {
  type: fieldTypes.SELECT,
  name: 'paymentAggregator',
  label: I18n.t(attributeLabels.paymentAggregator),
  placeholder: I18n.t('COMMON.SELECT_OPTION.ANY'),
  className: fieldClassNames.MEDIUM,
  /* no logic for now, we have just one aggregator */
  selectOptions: [aggregators.CASHIER, aggregators.MANUAL]
    .map(value => ({ value, label: I18n.t(aggregatorsLabels[value]) })),
}, {
  type: fieldTypes.SELECT,
  name: 'paymentMethods',
  label: I18n.t(attributeLabels.paymentMethod),
  multiple: true,
  placeholder: I18n.t('COMMON.SELECT_OPTION.ANY'),
  className: fieldClassNames.MEDIUM,
  selectOptions: uniq([...Object.keys(methods), ...Object.keys(manualPaymentMethods)])
    .map((method) => {
      let label = method;

      if (methodsLabels[method]) {
        label = I18n.t(methodsLabels[method]);
      }

      if (manualPaymentMethodsLabels[method]) {
        label = I18n.t(manualPaymentMethodsLabels[method]);
      }

      return ({
        value: method,
        label,
      });
    }),
}, {
  type: fieldTypes.SELECT,
  name: 'statuses',
  label: I18n.t(attributeLabels.statuses),
  placeholder: I18n.t('COMMON.SELECT_OPTION.ANY'),
  className: fieldClassNames.MEDIUM,
  multiple: true,
  selectOptions: Object
    .values(statuses)
    .map(value => ({ value, label: renderLabel(value, statusesLabels) })),
}, {
  type: fieldTypes.SELECT,
  name: 'agentIds',
  label: I18n.t(attributeLabels.originalAgents),
  placeholder: I18n.t('COMMON.SELECT_OPTION.ANY'),
  className: fieldClassNames.MEDIUM,
  disabled: disabledOriginalAgentField,
  multiple: true,
  selectOptions: originalAgents.map(({ fullName, uuid }) => ({ value: uuid, label: fullName })),
},
!isClientView && currencyField(currencies),
{
  type: fieldTypes.RANGE,
  className: fieldClassNames.MEDIUM,
  label: I18n.t(attributeLabels.amount),
  fields: [{
    type: fieldTypes.INPUT,
    name: 'amountFrom',
    inputType: 'number',
    normalize: normalize.FLOAT,
    placeholder: '0.0',
  }, {
    type: fieldTypes.INPUT,
    name: 'amountTo',
    inputType: 'number',
    normalize: normalize.FLOAT,
    placeholder: '0.0',
  }],
}, {
  type: fieldTypes.RANGE,
  className: fieldClassNames.BIG,
  label: I18n.t(attributeLabels.creationDateRange),
  fields: [{
    type: fieldTypes.DATE,
    name: 'creationTimeFrom',
    placeholder: I18n.t(attributeLabels.startDate),
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
    placeholder: I18n.t(attributeLabels.endDate),
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
  label: I18n.t(attributeLabels.modificationDateRange),
  fields: [{
    type: fieldTypes.DATE,
    name: 'modificationTimeFrom',
    placeholder: I18n.t(attributeLabels.startDate),
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
    placeholder: I18n.t(attributeLabels.endDate),
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
  label: I18n.t(attributeLabels.accountType),
  placeholder: I18n.t('COMMON.SELECT_OPTION.ANY'),
  className: fieldClassNames.MEDIUM,
  selectOptions: accountTypes.map(({ label, value }) => ({ value, label })),
}];
