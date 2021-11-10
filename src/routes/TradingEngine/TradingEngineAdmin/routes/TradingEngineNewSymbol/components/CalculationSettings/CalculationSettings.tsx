/* eslint-disable */
import React from 'react';
import I18n from 'i18n';
import {Field} from "formik";
import {
  FormikInputField,
} from 'components/Formik';
import './CalculationSettings.scss';

interface Props {

}

const CalculationSettings = (props: Props) => {
  const {
  } = props;

  return (
    <>
      <div className="CalculationSettings__section-header">
        <div className="CalculationSettings__section-title">
          {I18n.t('TRADING_ENGINE.NEW_SYMBOL.CALCULATION')}
        </div>
      </div>
      <Field
        name="сontractSize"
        label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.CONTRACT_SIZE_LABEL')}
        className="CalculationSettings__field"
        component={FormikInputField}
      />
      <Field
        name="Percentage"
        label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.PERCENTAGE_LABEL')}
        className="CalculationSettings__field"
        component={FormikInputField}
      />
      <Field
        name="marginСalculation"
        label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.MARGIN_CALCULATION_LABEL')}
        className="CalculationSettings__field"
        component={FormikInputField}
      />
      <Field
        name="profitCalculation"
        label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.PROFIT_CALCULATION_LABEL')}
        className="CalculationSettings__field"
        component={FormikInputField}
      />
    </>
  );
};

export default React.memo(CalculationSettings);
