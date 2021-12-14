import React from 'react';
import I18n from 'i18n';
import { Field } from 'formik';
import {
  FormikInputField,
  FormikSelectField,
} from 'components/Formik';
import { marginCalculationLabel, profitCalculationLabel } from '../../constants';
import './CalculationSettings.scss';

const FiltrationSettings = () => (
  <div className="FiltrationSettings">
    <div className="CalculationSettings__header">
      <div className="CalculationSettings__section-title">
        {I18n.t('TRADING_ENGINE.NEW_SYMBOL.CALCULATION')}
      </div>
    </div>
    <div className="CalculationSettings__field-container">
      <Field
        type="number"
        name="lotSize"
        label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.CONTRACT_SIZE_LABEL')}
        className="CalculationSettings__field"
        component={FormikInputField}
      />
      <Field
        type="number"
        name="percentage"
        label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.PERCENTAGE_LABEL')}
        className="CalculationSettings__field"
        component={FormikInputField}
      />
    </div>
    <div className="CalculationSettings__field-container">

      <Field
        name="marginCalculation"
        disabled
        label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.MARGIN_CALCULATION_LABEL')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
        className="CalculationSettings__field"
        component={FormikSelectField}
        searchable
      >
        {marginCalculationLabel.map(({ name, value }) => (
          <option key={name} value={value}>
            {I18n.t(name)}
          </option>
        ))}
      </Field>
      <Field
        name="profitCalculation"
        disabled
        label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.PROFIT_CALCULATION_LABEL')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
        className="CalculationSettings__field"
        component={FormikSelectField}
        searchable
      >
        {profitCalculationLabel.map(({ name, value }) => (
          <option key={value} value={value}>
            {I18n.t(name)}
          </option>
        ))}
      </Field>
    </div>
  </div>
);

export default React.memo(FiltrationSettings);
