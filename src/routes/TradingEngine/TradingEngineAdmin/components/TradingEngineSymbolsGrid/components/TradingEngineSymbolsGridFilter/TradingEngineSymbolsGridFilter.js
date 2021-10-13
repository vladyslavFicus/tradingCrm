import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import compose from 'compose-function';
import { Formik, Form, Field } from 'formik';
import PropTypes from 'constants/propTypes';
import { FormikSelectField } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components/UI';
import SymbolsQuery from './graphql/SymbolsQuery';
import './TradingEngineSymbolsGridFilter.scss';

class TradingEngineSymbolsGridFilter extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    handleRefetch: PropTypes.func.isRequired,
    symbolsQuery: PropTypes.query(PropTypes.arrayOf(PropTypes.symbolsTradingEngineType)).isRequired,
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
      symbolsQuery,
    } = this.props;

    const symbols = symbolsQuery.data?.tradingEngineSymbols || [];

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
                name="symbolNames"
                label={I18n.t('TRADING_ENGINE.SYMBOLS.FILTER_FORM.SYMBOL_LABEL')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                className="TradingEngineSymbolsGridFilter__field"
                component={FormikSelectField}
                withAnyOption
                searchable
                withFocus
                multiple
              >
                {symbols.map(({ name }) => (
                  <option key={name} value={name}>
                    {name}
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

export default compose(
  withRouter,
  withRequests({
    symbolsQuery: SymbolsQuery,
  }),
)(TradingEngineSymbolsGridFilter);
