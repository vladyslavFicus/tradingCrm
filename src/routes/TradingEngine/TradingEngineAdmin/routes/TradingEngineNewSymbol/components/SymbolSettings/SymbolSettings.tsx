/* eslint-disable */
import React, { Suspense } from 'react';
import I18n from 'i18n';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom';
import {Field} from "formik";
import {
  FormikInputField,
  FormikSelectField,
} from 'components/Formik';
import './SymbolSettings.scss';

interface Props {
  symbols: [],
}

const SymbolSettings = (props: Props) => {
  const {
    symbols,
  } = props;

  return (
    <>
      <div className="SymbolSettings__section-header">
        <div className="SymbolSettings__section-title">
          {I18n.t('TRADING_ENGINE.NEW_SYMBOL.SYMBOL')}
        </div>
      </div>
      <div className="SymbolSettings">
        <Field
          name="symbol"
          label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.SYMBOL_LABEL')}
          placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
          className="SymbolSettings__field"
          component={FormikSelectField}
          withAnyOption
          searchable
          withFocus
        >
          {symbols.map(({ name }) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Field>
        <Field
          name="source"
          label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.SOURCE_LABEL')}
          placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
          className="SymbolSettings__field"
          component={FormikSelectField}
          withAnyOption
          searchable
          withFocus
        >
          {symbols.map(({ name }) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Field>
        <Field
          name="digits"
          label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.DIGITS_LABEL')}
          className="SymbolSettings__field"
          component={FormikSelectField}
          withFocus
        >
          {[0,1,2,3,4,5,6,7].map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </Field>
        <Field
          name="description"
          label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.DESCRIPTION_LABEL')}
          className="SymbolSettings__field"
          component={FormikInputField}
        />
        <Field
          name="security"
          label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.SECURITY_LABEL')}
          placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
          className="SymbolSettings__field"
          component={FormikSelectField}
          withAnyOption
          searchable
          withFocus
        >
          {symbols.map(({ name }) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Field>
        <Field
          name="type"
          label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.TYPE_LABEL')}
          placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
          className="SymbolSettings__field"
          component={FormikSelectField}
          withAnyOption
          searchable
          withFocus
        >
          {symbols.map(({ name }) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Field>
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
        <Field
          name="background"
          label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.BACKGROUND_LABEL')}
          placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
          className="SymbolSettings__field"
          component={FormikSelectField}
          withAnyOption
          searchable
          withFocus
        >
          {symbols.map(({ name }) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Field>
        <Field
          name="spreadBid"
          label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.SPREAD_BID_LABEL')}
          className="SymbolSettings__field"
          component={FormikInputField}
        />
        <Field
          name="spreadAsk"
          label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.SPREAD_ASK_LABEL')}
          className="SymbolSettings__field"
          component={FormikInputField}
        />
        <Field
          name="Limit"
          label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.LIMIT_STOP_LABEL')}
          className="SymbolSettings__field"
          component={FormikInputField}
        />
      </div>
    </>
  );
};

export default React.memo(SymbolSettings);
