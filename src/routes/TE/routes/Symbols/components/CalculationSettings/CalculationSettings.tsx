import React from 'react';
import { Field, FormikProps } from 'formik';
import I18n from 'i18n';
import {
  FormikInputField,
} from 'components/Formik';
import Input from 'components/Input';
import { FormValues } from '../../types';
import './CalculationSettings.scss';

const CalculationSettings = (props: FormikProps<FormValues>) => (
  <div className="CalculationSettings">
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
      <Input
        name="margin"
        disabled
        value={I18n.t(`TRADING_ENGINE.SYMBOL.CALCULATION_LABELS.MARGIN_CALCULATION_${props.values.symbolType}`)}
        className="CalculationSettings__field"
      />
      <Input
        name="profit"
        disabled
        value={I18n.t(`TRADING_ENGINE.SYMBOL.CALCULATION_LABELS.PROFIT_CALCULATION_${props.values.symbolType}`)}
        className="CalculationSettings__field"
      />
    </div>
  </div>
);

export default React.memo(CalculationSettings);
