import {
  fieldTypes,
  fieldClassNames,
  normalize,
  validators,
} from 'components/ReduxForm/ReduxFieldsConstructor';
import { accountTypes } from 'constants/accountTypes';
import { statuses as operatorsStasuses } from 'constants/operators';
import {
  types,
  symbols,
  statuses,
  filterLabels,
  filterPlaceholders,
} from '../../constants';

export default ({
  disabled,
  accounts,
  originalAgents,
  disabledOriginalAgentField,
}) => ([
  {
    name: 'tradeId',
    type: fieldTypes.INPUT,
    inputType: 'number',
    label: filterLabels.tradeId,
    placeholder: filterPlaceholders.tradeId,
    className: fieldClassNames.BIG,
    optionsWithoutI18n: true,
    disabled,
  },
  {
    name: 'loginIds',
    type: fieldTypes.SELECT,
    label: filterLabels.loginIds,
    placeholder: filterPlaceholders.loginIds,
    multiple: true,
    className: fieldClassNames.MEDIUM,
    selectOptions: accounts.map(({ login }) => ({
      value: login,
      label: String(login),
    })),
    optionsWithoutI18n: true,
    disabled,
  },
  {
    name: 'cmd',
    type: fieldTypes.SELECT,
    label: filterLabels.cmd,
    placeholder: filterPlaceholders.cmd,
    className: fieldClassNames.MEDIUM,
    selectOptions: types.map(({ value, label }) => ({
      value,
      label,
    })),
    withAnyOption: true,
    disabled,
  },
  {
    name: 'symbol',
    type: fieldTypes.SELECT,
    label: filterLabels.symbol,
    placeholder: filterPlaceholders.symbol,
    className: fieldClassNames.MEDIUM,
    selectOptions: symbols.map(({ value, label }) => ({
      value,
      label,
    })),
    withAnyOption: true,
    disabled,
  },
  {
    name: 'agentIds',
    type: fieldTypes.SELECT,
    label: filterLabels.agentIds,
    placeholder: filterPlaceholders.agentIds,
    multiple: true,
    className: fieldClassNames.MEDIUM,
    selectOptions: originalAgents.map(({ fullName, uuid, operatorStatus }) => ({
      value: uuid,
      label: fullName,
      className:
        operatorStatus === operatorsStasuses.INACTIVE
        || operatorStatus === operatorsStasuses.CLOSE
          ? 'color-inactive'
          : '',
    })),
    optionsWithoutI18n: true,
    disabled: disabled || disabledOriginalAgentField,
  },
  {
    type: fieldTypes.RANGE,
    className: fieldClassNames.MEDIUM,
    label: filterLabels.volume,
    fields: [
      {
        type: fieldTypes.INPUT,
        name: 'volumeFrom',
        inputType: 'number',
        step: '0.01',
        normalize: normalize.FLOAT,
        placeholder: filterPlaceholders.volumeFrom,
        withoutI18n: true,
        disabled,
      },
      {
        type: fieldTypes.INPUT,
        name: 'volumeTo',
        inputType: 'number',
        step: '0.01',
        normalize: normalize.FLOAT,
        placeholder: filterPlaceholders.volumeTo,
        withoutI18n: true,
        disabled,
      },
    ],
  },
  {
    name: 'status',
    type: fieldTypes.SELECT,
    label: filterLabels.status,
    placeholder: filterPlaceholders.status,
    className: fieldClassNames.MEDIUM,
    selectOptions: statuses.map(({ value, label }) => ({
      value,
      label,
    })),
    withAnyOption: true,
    disabled,
  },
  {
    name: 'tradeType',
    type: fieldTypes.SELECT,
    label: filterLabels.tradeType,
    placeholder: filterPlaceholders.tradeType,
    className: fieldClassNames.MEDIUM,
    selectOptions: accountTypes.map(({ value, label }) => ({
      value,
      label,
    })),
    withAnyOption: true,
    disabled,
  },
  {
    type: fieldTypes.RANGE,
    className: fieldClassNames.BIG,
    label: filterLabels.openTime,
    fields: [
      {
        type: fieldTypes.DATE,
        name: 'openTimeStart',
        placeholder: filterPlaceholders.openTimeStart,
        dateValidator: {
          type: validators.START_DATE,
          fieldName: 'openTimeEnd',
        },
        pickerClassName: 'left-side',
        withTime: true,
        timePresets: true,
        closeOnSelect: false,
      },
      {
        type: fieldTypes.DATE,
        name: 'openTimeEnd',
        placeholder: filterPlaceholders.openTimeEnd,
        dateValidator: {
          type: validators.END_DATE,
          fieldName: 'openTimeStart',
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
    label: filterLabels.closeTime,
    fields: [
      {
        type: fieldTypes.DATE,
        name: 'closeTimeStart',
        placeholder: filterPlaceholders.closeTimeStart,
        dateValidator: {
          type: validators.START_DATE,
          fieldName: 'closeTimeEnd',
        },
        pickerClassName: 'left-side',
        withTime: true,
        timePresets: true,
        closeOnSelect: false,
      },
      {
        type: fieldTypes.DATE,
        name: 'closeTimeEnd',
        placeholder: filterPlaceholders.closeTimeEnd,
        dateValidator: {
          type: validators.END_DATE,
          fieldName: 'closeTimeStart',
        },
        withTime: true,
        timePresets: true,
        isDateRangeEndValue: true,
        closeOnSelect: false,
      },
    ],
  },
]);
