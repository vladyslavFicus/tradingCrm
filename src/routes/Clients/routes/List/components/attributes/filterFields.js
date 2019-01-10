import React from 'react';
import { I18n } from 'react-redux-i18n';
import keyMirror from 'keymirror';
import { statusesLabels, filterLabels } from '../../../../../../constants/user';
import { salesStatuses } from '../../../../../../constants/salesStatuses';
import { retentionStatuses } from '../../../../../../constants/retentionStatuses';
import {
  fieldTypes,
  fieldClassNames,
  normalize,
  validators,
} from '../../../../../../components/ReduxForm/ReduxFieldsConstructor';

const acquisitionStatuses = [{
  value: 'SALES',
  label: 'COMMON.SALES',
}, {
  value: 'RETENTION',
  label: 'COMMON.RETENTION',
}];

const assignStatuses = [{
  value: 'ASSIGN',
  label: 'COMMON.ASSIGN',
}, {
  value: 'UN_ASSIGN',
  label: 'COMMON.UN_ASSIGN',
}];

const kycStatuses = [{
  value: 'NO_KYC',
  label: 'KYC_REQUESTS.STATUS.NO_KYC',
}, {
  value: 'PENDING',
  label: 'KYC_REQUESTS.STATUS.PENDING',
}, {
  value: 'VERIFIED',
  label: 'KYC_REQUESTS.STATUS.VERIFIED',
}, {
  value: 'REFUSED',
  label: 'KYC_REQUESTS.STATUS.REFUSED',
}, {
  value: 'DOCUMENTS_SENT',
  label: 'KYC_REQUESTS.STATUS.DOCUMENTS_SENT',
}];

const firstDepositStatuses = [{
  value: 'YES',
  label: 'COMMON.YES',
}, {
  value: 'NO',
  label: 'COMMON.NO',
}];

export const fieldNames = keyMirror({
  desks: null,
  teams: null,
});

export default (
  countries,
  desks,
  teams,
  branchesLoading,
  teamLoading,
  onFieldChange,
) => [{
  type: fieldTypes.INPUT,
  name: 'searchValue',
  label: I18n.t(filterLabels.searchValue),
  placeholder: 'Name, email, ID...',
  inputAddon: <i className="icon icon-search" />,
  id: 'users-list-search-field',
  className: fieldClassNames.BIG,
}, {
  type: fieldTypes.SELECT,
  name: 'countries',
  label: I18n.t(filterLabels.country),
  placeholder: I18n.t('COMMON.SELECT_OPTION.ANY'),
  multiple: true,
  className: fieldClassNames.MEDIUM,
  selectOptions: Object
    .keys(countries)
    .map(value => ({ value, label: countries[value] })),
}, {
  type: fieldTypes.SELECT,
  name: 'desks',
  label: I18n.t(filterLabels.desks),
  placeholder: (!branchesLoading && desks.length === 0)
    ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
    : I18n.t('COMMON.SELECT_OPTION.ANY'),
  className: fieldClassNames.MEDIUM,
  onFieldChange,
  disabled: branchesLoading,
  selectOptions: desks.map(({ uuid, name }) => ({ value: uuid, label: I18n.t(name) })),
}, {
  type: fieldTypes.SELECT,
  name: 'teams',
  label: I18n.t(filterLabels.teams),
  placeholder: ((!branchesLoading || !teamLoading) && teams.length === 0)
    ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
    : I18n.t('COMMON.SELECT_OPTION.ANY'),
  className: fieldClassNames.MEDIUM,
  onFieldChange,
  disabled: branchesLoading || teamLoading,
  selectOptions: teams.map(({ uuid, name }) => ({ value: uuid, label: I18n.t(name) })),
}, {
  type: fieldTypes.SELECT,
  name: 'status',
  label: I18n.t(filterLabels.status),
  placeholder: I18n.t('COMMON.SELECT_OPTION.ANY'),
  className: fieldClassNames.MEDIUM,
  selectOptions: Object.keys(statusesLabels).map(value => ({ value, label: I18n.t(statusesLabels[value]) })),
}, {
  type: fieldTypes.SELECT,
  name: 'acquisitionStatus',
  label: I18n.t(filterLabels.acquisitionStatus),
  placeholder: I18n.t('COMMON.SELECT_OPTION.ANY'),
  className: fieldClassNames.MEDIUM,
  selectOptions: acquisitionStatuses.map(({ value, label }) => ({ value, label: I18n.t(label) })),
}, {
  type: fieldTypes.SELECT,
  name: 'salesStatuses',
  label: I18n.t(filterLabels.salesStatus),
  placeholder: I18n.t('COMMON.SELECT_OPTION.ANY'),
  className: fieldClassNames.MEDIUM,
  multiple: true,
  selectOptions: Object
    .keys(salesStatuses)
    .map(value => ({ value, label: I18n.t(salesStatuses[value]) })),
}, {
  type: fieldTypes.SELECT,
  name: 'retentionStatuses',
  label: I18n.t(filterLabels.retentionStatus),
  placeholder: I18n.t('COMMON.SELECT_OPTION.ANY'),
  className: fieldClassNames.MEDIUM,
  multiple: true,
  selectOptions: Object
    .keys(retentionStatuses)
    .map(value => ({ value, label: I18n.t(retentionStatuses[value]) })),
}, {
  type: fieldTypes.SELECT,
  name: 'assignStatus',
  label: I18n.t(filterLabels.assignStatus),
  placeholder: I18n.t('COMMON.SELECT_OPTION.ANY'),
  className: fieldClassNames.MEDIUM,
  selectOptions: assignStatuses.map(({ value, label }) => ({ value, label: I18n.t(label) })),
}, {
  type: fieldTypes.SELECT,
  name: 'kycStatus',
  label: I18n.t(filterLabels.kycStatus),
  placeholder: I18n.t('COMMON.SELECT_OPTION.ANY'),
  className: fieldClassNames.MEDIUM,
  selectOptions: kycStatuses.map(({ value, label }) => ({ value, label: I18n.t(label) })),
}, {
  type: fieldTypes.SELECT,
  name: 'firstDeposit',
  label: I18n.t(filterLabels.firstDeposit),
  placeholder: I18n.t('COMMON.SELECT_OPTION.ANY'),
  className: fieldClassNames.MEDIUM,
  selectOptions: firstDepositStatuses.map(({ value, label }) => ({ value, label: I18n.t(label) })),
}, {
  type: fieldTypes.RANGE,
  className: fieldClassNames.SMALL,
  label: I18n.t(filterLabels.balance),
  fields: [{
    type: fieldTypes.INPUT,
    inputType: 'number',
    name: 'tradingBalanceFrom',
    normalize: normalize.FLOAT,
    placeholder: '0.00',
  }, {
    type: fieldTypes.INPUT,
    inputType: 'number',
    name: 'tradingBalanceTo',
    normalize: normalize.FLOAT,
    placeholder: '0.00',
  }],
}, {
  type: fieldTypes.RANGE,
  className: fieldClassNames.BIG,
  label: I18n.t(filterLabels.registrationDate),
  fields: [{
    type: fieldTypes.DATE,
    name: 'registrationDateFrom',
    placeholder: I18n.t('COMMON.DATE_OPTIONS.START_DATE'),
    closeOnSelect: false,
    dateValidator: {
      type: validators.START_DATE,
      fieldName: 'registrationDateTo',
    },
    withTime: true,
    timePresets: true,
  }, {
    type: fieldTypes.DATE,
    name: 'registrationDateTo',
    placeholder: I18n.t('COMMON.DATE_OPTIONS.END_DATE'),
    closeOnSelect: false,
    dateValidator: {
      type: validators.END_DATE,
      fieldName: 'registrationDateFrom',
    },
    withTime: true,
    timePresets: true,
    isDateRangeEndValue: true,
  }],
}];

