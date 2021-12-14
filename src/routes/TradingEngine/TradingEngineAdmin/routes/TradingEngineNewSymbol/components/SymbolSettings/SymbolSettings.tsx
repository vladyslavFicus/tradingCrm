import React from 'react';
import I18n from 'i18n';
import { Field, FormikProps } from 'formik';
import {
  FormikInputField,
  FormikSelectField,
  FormikTextAreaField,
} from 'components/Formik';
import { backgroundColor, symbolTypeLabels } from '../../constants';
import { FormValues, SymbolType } from '../../types';
import './SymbolSettings.scss';

interface Props {
  symbolsSources: [],
  securities: {
    name: string,
  }[],
}

const SymbolSettings = (props: Props & FormikProps<FormValues>) => {
  const {
    symbolsSources,
    securities,
    setValues,
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
          {I18n.t('TRADING_ENGINE.NEW_SYMBOL.SYMBOL')}
        </div>
      </div>
      <div className="SymbolSettings__field-container">
        <Field
          name="symbol"
          label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.SYMBOL_LABEL')}
          className="SymbolSettings__field"
          component={FormikInputField}
        />
        <Field
          name="source"
          label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.SOURCE_LABEL')}
          placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
          className="SymbolSettings__field"
          component={FormikSelectField}
          withAnyOption
          searchable
        >
          {symbolsSources.map(i => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </Field>
        <Field
          name="digits"
          label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.DIGITS_LABEL')}
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
          label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.DESCRIPTION_LABEL')}
          className="SymbolSettings__field"
          component={FormikTextAreaField}
        />
      </div>
      <div className="SymbolSettings__field-container">
        <Field
          name="securityName"
          label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.SECURITY_LABEL')}
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
          name="symbolType"
          label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.TYPE_LABEL')}
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
          name="baseCurrency"
          label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.BASE_CURRENCY_LABEL')}
          className="SymbolSettings__field"
          component={FormikInputField}
        />
        <Field
          name="quoteCurrency"
          label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.QUOTE_CURRENCY_LABEL')}
          className="SymbolSettings__field"
          component={FormikInputField}
        />
      </div>
      <div className="SymbolSettings__field-container--third">
        <Field
          name="backgroundColor"
          label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.BACKGROUND_LABEL')}
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
          label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.SPREAD_BID_LABEL')}
          className="SymbolSettings__field"
          component={FormikInputField}
        />
        <Field
          type="number"
          name="askSpread"
          label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.SPREAD_ASK_LABEL')}
          className="SymbolSettings__field"
          component={FormikInputField}
        />
        <Field
          type="number"
          name="stopsLevel"
          label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.LIMIT_STOP_LABEL')}
          className="SymbolSettings__field"
          component={FormikInputField}
        />
      </div>
    </div>
  );
};

export default React.memo(SymbolSettings);
