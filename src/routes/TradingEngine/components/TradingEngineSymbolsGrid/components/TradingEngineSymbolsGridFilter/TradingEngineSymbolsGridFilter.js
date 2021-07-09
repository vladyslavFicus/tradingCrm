import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import PropTypes from 'constants/propTypes';
import {
  FormikInputField,
  FormikSelectField,
} from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components/UI';
import {
  types,
  symbols,
} from './constants';
import './TradingEngineSymbolsGridFilter.scss';

class TradingEngineSymbolsGridFilter extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    handleRefetch: PropTypes.func.isRequired,
  };

  handleSubmit = (values) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });
  };

  handleReset = (resetForm) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        filters: null,
      },
    });

    resetForm();
  };

  render() {
    const {
      location: { state },
      handleRefetch,
    } = this.props;

    return (
      <Formik
        enableReinitialize
        initialValues={state?.filters || { tradeType: 'LIVE' }}
        onSubmit={this.handleSubmit}
      >
        {({
          isSubmitting,
          resetForm,
          values,
          dirty,
        }) => (
          <Form className="TradingEngineSymbolsGridFilter">
            <div className="TradingEngineSymbolsGridFilter__fields">
              <Field
                name="searchKeyword"
                label={I18n.t('TRADING_ENGINE.SYMBOLS.FILTER_FORM.SEARCH_BY')}
                placeholder={I18n.t('TRADING_ENGINE.SYMBOLS.FILTER_FORM.SEARCH_BY_PLACEHOLDER')}
                className="TradingEngineSymbolsGridFilter__field TradingEngineSymbolsGridFilter__field--large"
                component={FormikInputField}
                addition={<i className="icon icon-search" />}
                withFocus
              />
              <Field
                name="operationType"
                label={I18n.t('TRADING_ENGINE.SYMBOLS.FILTER_FORM.TYPE_LABEL')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                className="TradingEngineSymbolsGridFilter__field"
                component={FormikSelectField}
                withAnyOption
                searchable
                withFocus
              >
                {types.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {I18n.t(label)}
                  </option>
                ))}
              </Field>
              <Field
                name="symbol"
                label={I18n.t('TRADING_ENGINE.SYMBOLS.FILTER_FORM.SYMBOL_LABEL')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                className="TradingEngineSymbolsGridFilter__field"
                component={FormikSelectField}
                withAnyOption
                searchable
                withFocus
              >
                {symbols.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {I18n.t(label)}
                  </option>
                ))}
              </Field>
            </div>
            <div className="TradingEngineSymbolsGridFilter__buttons">
              <RefreshButton
                className="TradingEngineSymbolsGridFilter__button"
                onClick={handleRefetch}
              />
              <Button
                className="TradingEngineSymbolsGridFilter__button"
                onClick={() => this.handleReset(resetForm)}
                disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>
              <Button
                className="TradingEngineSymbolsGridFilter__button"
                type="submit"
                disabled={!dirty || isSubmitting}
                primary
              >
                {I18n.t('COMMON.APPLY')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

export default withRouter(TradingEngineSymbolsGridFilter);
