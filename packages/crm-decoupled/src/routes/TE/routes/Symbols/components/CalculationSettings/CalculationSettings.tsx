import React from 'react';
import { Field, FormikProps } from 'formik';
import { Input } from 'components';
import I18n from 'i18n';
import {
  FormikInputField,
} from 'components/Formik';
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
        data-testid="CalculationSettings-lotSizeInput"
        label={I18n.t('TRADING_ENGINE.SYMBOL.CONTRACT_SIZE_LABEL')}
        className="CalculationSettings__field"
        component={FormikInputField}
      />
      <Field
        type="number"
        name="percentage"
        data-testid="CalculationSettings-percentageInput"
        label={I18n.t('TRADING_ENGINE.SYMBOL.PERCENTAGE_LABEL')}
        className="CalculationSettings__field"
        component={FormikInputField}
      />
    </div>
    <div className="CalculationSettings__field-container">
      <Input
        name="margin"
        disabled
        data-testid="CalculationSettings-marginInput"
        value={I18n.t(`TRADING_ENGINE.SYMBOL.CALCULATION_LABELS.MARGIN_CALCULATION_${props.values.symbolType}`)}
        className="CalculationSettings__field"
      />
      <Input
        name="profit"
        disabled
        data-testid="CalculationSettings-profitInput"
        value={I18n.t(`TRADING_ENGINE.SYMBOL.CALCULATION_LABELS.PROFIT_CALCULATION_${props.values.symbolType}`)}
        className="CalculationSettings__field"
      />
    </div>
  </div>
);

export default React.memo(CalculationSettings);
