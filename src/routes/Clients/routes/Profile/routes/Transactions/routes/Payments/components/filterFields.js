import React from 'react';
import { uniq } from 'lodash';
import { I18n } from 'react-redux-i18n';
import {
  fieldTypes,
  fieldClassNames,
  normalize,
  validators,
} from '../../../../../../../../../components/ListFilterForm';
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
} from '../../../../../../../../../constants/payment';
import renderLabel from '../../../../../../../../../utils/renderLabel';

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
};

const attributePlaceholders = {
  keyword: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_PLACEHOLDERS.KEYWORD',
};

export default [{
  type: fieldTypes.INPUT,
  name: 'searchParam',
  label: I18n.t(attributeLabels.keyword),
  placeholder: I18n.t(attributePlaceholders.keyword),
  inputAddon: <i className="icon icon-search" />,
  id: 'transactions-list-filters-search',
  className: fieldClassNames.BIG,
}, {
  type: fieldTypes.SELECT,
  name: 'paymentTypes',
  label: I18n.t(attributeLabels.type),
  placeholder: I18n.t('COMMON.SELECT_OPTION.DEFAULT'),
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
  placeholder: I18n.t('COMMON.SELECT_OPTION.DEFAULT'),
  className: fieldClassNames.MEDIUM,
  /* no logic for now, we have just one aggregator */
  selectOptions: [aggregators.CASHIER, aggregators.MANUAL]
    .map(value => ({ value, label: I18n.t(aggregatorsLabels[value]) })),
}, {
  type: fieldTypes.SELECT,
  name: 'paymentMethod',
  label: I18n.t(attributeLabels.paymentMethod),
  placeholder: I18n.t('COMMON.SELECT_OPTION.DEFAULT'),
  className: fieldClassNames.MEDIUM,
  selectOptions: uniq([...Object.keys(methods), ...Object.keys(manualPaymentMethods)])
    .map((method) => {
      let label = null;

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
  placeholder: I18n.t('COMMON.SELECT_OPTION.DEFAULT'),
  className: fieldClassNames.MEDIUM,
  multiple: true,
  selectOptions: Object
    .values(statuses)
    .map(value => ({ value, label: renderLabel(value, statusesLabels) })),
}, {
  type: fieldTypes.RANGE,
  className: fieldClassNames.MEDIUM,
  label: I18n.t(attributeLabels.amount),
  fields: [{
    type: fieldTypes.INPUT,
    name: 'amountFrom',
    normalize: normalize.NUMBER,
    placeholder: '0.00',
  }, {
    type: fieldTypes.INPUT,
    name: 'amountTo',
    normalize: normalize.NUMBER,
    placeholder: '0.00',
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
  }, {
    type: fieldTypes.DATE,
    name: 'creationTimeTo',
    placeholder: I18n.t(attributeLabels.endDate),
    dateValidator: {
      type: validators.END_DATE,
      fieldName: 'creationTimeFrom',
    },
  }],
}];
