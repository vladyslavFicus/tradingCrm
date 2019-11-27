import React from 'react';
import keyMirror from 'keymirror';
import { statuses } from 'constants/operators';
import { filterLabels } from '../../../../../../constants/user';
import { leadAccountStatuses } from '../../../../constants';
import { salesStatuses } from '../../../../../../constants/salesStatuses';
import {
  fieldTypes,
  fieldClassNames,
  normalize,
  validators,
  parser,
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
  label: filterLabels.searchValue,
  placeholder: 'COMMON.SEARCH_BY.LEAD',
  id: 'users-list-search-field',
  inputAddon: <i className="icon icon-search" />,
  className: fieldClassNames.BIG,
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
  placeholder: 'COMMON.SELECT_OPTION.DEFAULT',
  multiple: true,
  className: fieldClassNames.MEDIUM,
  selectOptions: Object
    .keys(countries)
    .map(value => ({
      value,
      label: countries[value],
    })),
  optionsWithoutI18n: true,
}, {
  type: fieldTypes.SELECT,
  name: 'desks',
  label: filterLabels.desks,
  placeholder: (!branchesLoading && desks.length === 0)
    ? 'COMMON.SELECT_OPTION.NO_ITEMS'
    : 'COMMON.SELECT_OPTION.DEFAULT',
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
  name: 'teams',
  label: filterLabels.teams,
  placeholder: (!branchesLoading && teams.length === 0)
    ? 'COMMON.SELECT_OPTION.NO_ITEMS'
    : 'COMMON.SELECT_OPTION.DEFAULT',
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
  name: 'salesAgents',
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
  name: 'salesStatuses',
  label: filterLabels.salesStatus,
  placeholder: 'COMMON.SELECT_OPTION.DEFAULT',
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
  name: 'status',
  label: filterLabels.accountStatus,
  placeholder: (!branchesLoading && teams.length === 0)
    ? 'COMMON.SELECT_OPTION.NO_ITEMS'
    : 'COMMON.SELECT_OPTION.DEFAULT',
  className: fieldClassNames.MEDIUM,
  customOnChange: true,
  selectOptions: Object
    .values(leadAccountStatuses)
    .map(({ label, value }) => ({ label, value })),
}, {
  type: fieldTypes.RANGE,
  className: fieldClassNames.BIG,
  label: filterLabels.registrationDate,
  fields: [{
    type: fieldTypes.DATE,
    name: 'registrationDateStart',
    placeholder: 'COMMON.DATE_OPTIONS.START_DATE',
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
    placeholder: 'COMMON.DATE_OPTIONS.END_DATE',
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
  parse: parser.ONLY_POSITIVE,
  label: 'COMMON.FILTERS.SEARCH_LIMIT',
  placeholder: 'COMMON.UNLIMITED',
  className: fieldClassNames.SMALL,
}];
