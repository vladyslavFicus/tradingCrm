import React from 'react';
import { Field, FormikProps } from 'formik';
import {
  FormikInputField,
  FormikSelectField,
  FormikTextAreaField,
} from 'components/Formik';
import I18n from 'i18n-config';
import { FormValues } from '../../types';
import './SymbolSettings.scss';

interface Props extends FormikProps<FormValues> {
  symbolsSources: {
    sourceName: string,
  }[],
  securities: {
    name: string,
  }[],
  handleChangeSymbolSource?: (symbolName: string) => void,
}

const SymbolSettings = (props: Props) => {
  const {
    symbolsSources,
    securities,
    handleChangeSymbolSource = () => {},
    setFieldValue,
    initialValues,
  } = props;

  const onChangeSymbolSource = async (symbolName: string) => {
    // Set field value before to avoid delay while symbol fetching for BE
    setFieldValue('source', symbolName);
    handleChangeSymbolSource(symbolName);
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
          data-testid="SymbolSettings-symbolInput"
          label={I18n.t('TRADING_ENGINE.SYMBOL.SYMBOL_LABEL')}
          className="SymbolSettings__field"
          component={FormikInputField}
        />
        <Field
          disabled={!!initialValues.symbol} // Disable field only if it's edit symbol page
          name="source"
          data-testid="SymbolSettings-sourceSelect"
          label={I18n.t('TRADING_ENGINE.SYMBOL.SOURCE_LABEL')}
          placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
          className="SymbolSettings__field"
          component={FormikSelectField}
          customOnChange={onChangeSymbolSource}
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
          data-testid="SymbolSettings-digitsInput"
          label={I18n.t('TRADING_ENGINE.SYMBOL.DIGITS_LABEL')}
          className="SymbolSettings__field"
          component={FormikInputField}
        />
      </div>
      <div className="SymbolSettings__field-container">
        <Field
          name="description"
          data-testid="SymbolSettings-descriptionTextArea"
          label={I18n.t('TRADING_ENGINE.SYMBOL.DESCRIPTION_LABEL')}
          className="SymbolSettings__field"
          component={FormikTextAreaField}
        />
      </div>
      <div className="SymbolSettings__field-container">
        <Field
          name="securityName"
          data-testid="SymbolSettings-securityNameSelect"
          label={I18n.t('TRADING_ENGINE.SYMBOL.SECURITY_LABEL')}
          placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
          className="SymbolSettings__field"
          component={FormikSelectField}
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
          data-testid="SymbolSettings-symbolTypeInput"
          label={I18n.t('TRADING_ENGINE.SYMBOL.TYPE_LABEL')}
          placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
          className="SymbolSettings__field"
          component={FormikInputField}
          searchable
        />
      </div>
      <div className="SymbolSettings__field-container">
        <Field
          disabled // Field should be disabled on new symbol and edit symbol page
          name="baseCurrency"
          data-testid="SymbolSettings-baseCurrencyInput"
          label={I18n.t('TRADING_ENGINE.SYMBOL.BASE_CURRENCY_LABEL')}
          className="SymbolSettings__field"
          component={FormikInputField}
        />
        <Field
          disabled // Field should be disabled on new symbol and edit symbol page
          name="quoteCurrency"
          data-testid="SymbolSettings-quoteCurrencyInput"
          label={I18n.t('TRADING_ENGINE.SYMBOL.QUOTE_CURRENCY_LABEL')}
          className="SymbolSettings__field"
          component={FormikInputField}
        />
      </div>
      <div className="SymbolSettings__field-container">
        <Field
          type="number"
          name="bidSpread"
          data-testid="SymbolSettings-bidSpreadInput"
          label={I18n.t('TRADING_ENGINE.SYMBOL.SPREAD_BID_LABEL')}
          className="SymbolSettings__field"
          component={FormikInputField}
        />
        <Field
          type="number"
          name="askSpread"
          data-testid="SymbolSettings-askSpreadInput"
          label={I18n.t('TRADING_ENGINE.SYMBOL.SPREAD_ASK_LABEL')}
          className="SymbolSettings__field"
          component={FormikInputField}
        />
        <Field
          type="number"
          name="stopsLevel"
          data-testid="SymbolSettings-stopsLevelInput"
          label={I18n.t('TRADING_ENGINE.SYMBOL.LIMIT_STOP_LABEL')}
          className="SymbolSettings__field"
          component={FormikInputField}
        />
      </div>
    </div>
  );
};

SymbolSettings.defaultProps = {
  handleChangeSymbolSource: () => {},
};

export default React.memo(SymbolSettings);
