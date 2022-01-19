import React from 'react';
import I18n from 'i18n';
import { Field, FormikProps } from 'formik';
import {
  FormikInputField,
} from 'components/Formik';
import Select from 'components/Select';
import { marginCalculationLabels, profitCalculationLabels } from '../../constants';
import { FormValues } from '../../../../types';
import './CalculationSettings.scss';

const FiltrationSettings = (props: FormikProps<FormValues>) => (
  <div className="FiltrationSettings">
    <div className="CalculationSettings__header">
      <div className="CalculationSettings__section-title">
        {I18n.t('TRADING_ENGINE.SYMBOL.CALCULATION')}
      </div>
    </div>
    <div className="CalculationSettings__field-container">
      <Field
        type="number"
        name="lotSize"
        label={I18n.t('TRADING_ENGINE.SYMBOL.CONTRACT_SIZE_LABEL')}
        className="CalculationSettings__field"
        component={FormikInputField}
      />
      <Field
        type="number"
        name="percentage"
        label={I18n.t('TRADING_ENGINE.SYMBOL.PERCENTAGE_LABEL')}
        className="CalculationSettings__field"
        component={FormikInputField}
      />
    </div>
    <div className="CalculationSettings__field-container">

      <Select
        disabled
        value={props.values.symbolType}
        label={I18n.t('TRADING_ENGINE.SYMBOL.MARGIN_CALCULATION_LABEL')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
        customClassName="CalculationSettings__field"
      >
        {marginCalculationLabels.map(({ name, value }) => (
          <option key={name} value={value}>
            {I18n.t(name)}
          </option>
        ))}
      </Select>
      <Select
        disabled
        value={props.values.symbolType}
        label={I18n.t('TRADING_ENGINE.SYMBOL.PROFIT_CALCULATION_LABEL')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
        customClassName="CalculationSettings__field"
      >
        {profitCalculationLabels.map(({ name, value }) => (
          <option key={value} value={value}>
            {I18n.t(name)}
          </option>
        ))}
      </Select>
    </div>
  </div>
);

export default React.memo(FiltrationSettings);
