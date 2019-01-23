import React from 'react';
import { I18n } from 'react-redux-i18n';
import keyMirror from 'keymirror';
import { filterLabels } from '../../../../../../constants/user';
import { leadAccountStatuses } from '../../../../constants';
import { salesStatuses } from '../../../../../../constants/salesStatuses';
import {
  fieldTypes,
  fieldClassNames,
  normalize,
  validators,
} from '../../../../../../components/ReduxForm/ReduxFieldsConstructor';

export const fieldNames = keyMirror({
  desks: null,
  teams: null,
  salesAgents: null,
});

export default (
  countries,
  desks,
  teams,
  branchesLoading,
  operators,
  operatorsLoading,
) => [{
  type: fieldTypes.INPUT,
  name: 'searchKeyword',
  label: I18n.t(filterLabels.searchValue),
  placeholder: 'Name, email, phone number, ID...',
  id: 'users-list-search-field',
  inputAddon: <i className="icon icon-search" />,
  className: fieldClassNames.BIG,
}, {
  type: fieldTypes.SELECT,
  name: 'countries',
  label: I18n.t(filterLabels.country),
  placeholder: I18n.t('COMMON.SELECT_OPTION.DEFAULT'),
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
    : I18n.t('COMMON.SELECT_OPTION.DEFAULT'),
  className: fieldClassNames.MEDIUM,
  customOnChange: true,
  disabled: branchesLoading || desks.length === 0,
  selectOptions: desks.map(({ uuid, name }) => ({ value: uuid, label: I18n.t(name) })),
}, {
  type: fieldTypes.SELECT,
  name: 'teams',
  label: I18n.t(filterLabels.teams),
  placeholder: (!branchesLoading && teams.length === 0)
    ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
    : I18n.t('COMMON.SELECT_OPTION.DEFAULT'),
  className: fieldClassNames.MEDIUM,
  customOnChange: true,
  disabled: branchesLoading || teams.length === 0,
  selectOptions: teams.map(({ uuid, name }) => ({ value: uuid, label: I18n.t(name) })),
}, {
  type: fieldTypes.SELECT,
  name: 'salesAgents',
  label: I18n.t(filterLabels.operators),
  placeholder: I18n.t('COMMON.SELECT_OPTION.DEFAULT'),
  className: fieldClassNames.MEDIUM,
  multiple: true,
  disabled: operatorsLoading || operators.length === 0,
  selectOptions: operators.map(({ uuid, fullName }) => ({ value: uuid, label: I18n.t(fullName) })),
}, {
  type: fieldTypes.SELECT,
  name: 'salesStatuses',
  label: I18n.t(filterLabels.salesStatus),
  placeholder: I18n.t('COMMON.SELECT_OPTION.DEFAULT'),
  className: fieldClassNames.MEDIUM,
  multiple: true,
  selectOptions: Object
    .keys(salesStatuses)
    .map(value => ({ value, label: I18n.t(salesStatuses[value]) })),
}, {
  type: fieldTypes.SELECT,
  name: 'status',
  label: I18n.t(filterLabels.accountStatus),
  placeholder: (!branchesLoading && teams.length === 0)
    ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
    : I18n.t('COMMON.SELECT_OPTION.DEFAULT'),
  className: fieldClassNames.MEDIUM,
  customOnChange: true,
  selectOptions: Object
    .values(leadAccountStatuses)
    .map(({ label, value }) => ({ label, value })),
}, {
  type: fieldTypes.RANGE,
  className: fieldClassNames.BIG,
  label: I18n.t(filterLabels.registrationDate),
  fields: [{
    type: fieldTypes.DATE,
    name: 'registrationDateStart',
    placeholder: I18n.t('COMMON.DATE_OPTIONS.START_DATE'),
    closeOnSelect: false,
    dateValidator: {
      type: validators.START_DATE,
      fieldName: 'registrationDateEnd',
    },
    withTime: true,
    timePresets: true,
  }, {
    type: fieldTypes.DATE,
    name: 'registrationDateEnd',
    placeholder: I18n.t('COMMON.DATE_OPTIONS.END_DATE'),
    closeOnSelect: false,
    dateValidator: {
      type: validators.END_DATE,
      fieldName: 'registrationDateStart',
    },
    withTime: true,
    timePresets: true,
    isDateRangeEndValue: true,
  }],
}, {
  type: fieldTypes.INPUT,
  inputType: 'number',
  name: 'size',
  normalize: normalize.NUMBER,
  label: I18n.t('COMMON.FILTERS.SEARCH_LIMIT'),
  placeholder: I18n.t('COMMON.UNLIMITED'),
  className: fieldClassNames.SMALL,
}];

