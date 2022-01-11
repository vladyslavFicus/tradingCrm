import React from 'react';
import I18n from 'i18n';
import { Field, FormikProps } from 'formik';
import {
  FormikInputField,
  FormikSelectField,
  FormikTextAreaField,
} from 'components/Formik';
import { backgroundColor, symbolTypeLabels } from '../../constants';
import { FormValues, SymbolType } from '../../../../types';
import './SymbolSettings.scss';

interface Props extends FormikProps<FormValues> {
  symbolsSources: {
    sourceName: string,
  }[],
  securities: {
    name: string,
  }[],
}

const SymbolSettings = (props: Props) => {
  const {
    symbolsSources,
    securities,
    setValues,
    initialValues,
    values,
  } = props;

  const onChangeSymbolType = (value: SymbolType) => {
    setValues({
      ...values,
      symbolType: value,
      marginCalculation: value,
      profitCalculation: value,
    });
  };

  return (
    <div className="SymbolSettings">
      <div className="SymbolSettings__section-header">
        <div className="SymbolSettings__section-title">
          {I18n.t('TRADING_ENGINE.SYMBOL.SYMBOL')}
        </div>
      </div>
      <div className="SymbolSettings__field-container">
        <Field
          disabled={!!initialValues.symbol} // Disable field only if it's edit symbol page
          name="symbol"
          label={I18n.t('TRADING_ENGINE.SYMBOL.SYMBOL_LABEL')}
          className="SymbolSettings__field"
          component={FormikInputField}
        />
        <Field
          disabled={!!initialValues.symbol} // Disable field only if it's edit symbol page
          name="source"
          label={I18n.t('TRADING_ENGINE.SYMBOL.SOURCE_LABEL')}
          placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
          className="SymbolSettings__field"
          component={FormikSelectField}
          searchable
        >
          {symbolsSources.map(({ sourceName }) => (
            <option key={sourceName} value={sourceName}>
              {sourceName}
            </option>
          ))}
        </Field>
        <Field
          disabled // Field should be disabled on new symbol and edit symbol page
          name="digits"
          label={I18n.t('TRADING_ENGINE.SYMBOL.DIGITS_LABEL')}
          className="SymbolSettings__field"
          component={FormikSelectField}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </Field>
      </div>
      <div className="SymbolSettings__field-container">
        <Field
          name="description"
          label={I18n.t('TRADING_ENGINE.SYMBOL.DESCRIPTION_LABEL')}
          className="SymbolSettings__field"
          component={FormikTextAreaField}
        />
      </div>
      <div className="SymbolSettings__field-container">
        <Field
          name="securityName"
          label={I18n.t('TRADING_ENGINE.SYMBOL.SECURITY_LABEL')}
          placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
          className="SymbolSettings__field"
          component={FormikSelectField}
          withAnyOption
          searchable
        >
          {securities.map(({ name }) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Field>
        <Field
          disabled // Field should be disabled on new symbol and edit symbol page
          name="symbolType"
          label={I18n.t('TRADING_ENGINE.SYMBOL.TYPE_LABEL')}
          placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
          className="SymbolSettings__field"
          component={FormikSelectField}
          searchable
          customOnChange={onChangeSymbolType}
        >
          {symbolTypeLabels.map(({ name, value }) => (
            <option key={value} value={value}>
              {I18n.t(name)}
            </option>
          ))}
        </Field>
      </div>
      <div className="SymbolSettings__field-container">
        <Field
          disabled // Field should be disabled on new symbol and edit symbol page
          name="baseCurrency"
          label={I18n.t('TRADING_ENGINE.SYMBOL.BASE_CURRENCY_LABEL')}
          className="SymbolSettings__field"
          component={FormikInputField}
        />
        <Field
          disabled // Field should be disabled on new symbol and edit symbol page
          name="quoteCurrency"
          label={I18n.t('TRADING_ENGINE.SYMBOL.QUOTE_CURRENCY_LABEL')}
          className="SymbolSettings__field"
          component={FormikInputField}
        />
      </div>
      <div className="SymbolSettings__field-container--third">
        <Field
          name="backgroundColor"
          label={I18n.t('TRADING_ENGINE.SYMBOL.BACKGROUND_LABEL')}
          placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
          className="SymbolSettings__field"
          component={FormikSelectField}
          withAnyOption
          searchable
        >
          {backgroundColor.map(({ name, value }) => (
            <option key={name} value={value}>
              {I18n.t(name)}
            </option>
          ))}
        </Field>
      </div>
      <div className="SymbolSettings__field-container">
        <Field
          type="number"
          name="bidSpread"
          label={I18n.t('TRADING_ENGINE.SYMBOL.SPREAD_BID_LABEL')}
          className="SymbolSettings__field"
          component={FormikInputField}
        />
        <Field
          type="number"
          name="askSpread"
          label={I18n.t('TRADING_ENGINE.SYMBOL.SPREAD_ASK_LABEL')}
          className="SymbolSettings__field"
          component={FormikInputField}
        />
        <Field
          type="number"
          name="stopsLevel"
          label={I18n.t('TRADING_ENGINE.SYMBOL.LIMIT_STOP_LABEL')}
          className="SymbolSettings__field"
          component={FormikInputField}
        />
      </div>
    </div>
  );
};

export default React.memo(SymbolSettings);
