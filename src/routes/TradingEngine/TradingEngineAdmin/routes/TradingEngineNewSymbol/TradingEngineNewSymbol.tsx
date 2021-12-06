import React, { PureComponent } from 'react';
import { Formik, Form } from 'formik';
import I18n from 'i18n';
import compose from 'compose-function';
import { parseErrors, withRequests } from 'apollo';
import { withRouter } from 'react-router-dom';
import { MutationResult, MutationOptions, QueryResult } from 'react-apollo';
import { withNotifications } from 'hoc';
import { createValidator } from 'utils/validator';
import { decodeNullValues } from 'components/Formik/utils';
import { Button } from 'components/UI';
import { Router } from 'types/router';
import { Notify, LevelType } from 'types/notify';
import SymbolSettings from './components/SymbolSettings';
import CalculationSettings from './components/CalculationSettings';
import SwapsSettings from './components/SwapsSettings';
import SessionsSettings from './components/SessionsSettings';
import FiltrationSettings from './components/FiltrationSettings';
import SymbolsQuery from './graphql/SymbolsQuery';
import SecuritiesQuery from './graphql/SecuritiesQuery';
import CreateSymbolMutation from './graphql/CreateSymbolMutation';
import './TradingEngineNewSymbol.scss';

interface SymbolSession {
  dayOfWeek: string,
  openTime: string,
  closeTime: string,
}

interface CreateSymbolResponse {
  createSymbol: null,
}

interface SecurityData {
  tradingEngineSecurities: {
    name: string,
  }[],
}

interface SymbolData {
  tradingEngineSymbols: {
    name: string,
  }[],
}

interface Props {
  notify: Notify,
  history: Router,
  symbolsQuery: QueryResult<SymbolData>,
  securitiesQuery: QueryResult<SecurityData>,
  createSymbol: (options: MutationOptions) => MutationResult<CreateSymbolResponse>,
}

class TradingEngineNewSymbol extends PureComponent<Props> {
  state = {
    symbolSessions: [],
  };

  handleSubmit = async ({ marginCalculation, profitCalculation, ...rest }: any) => {
    console.log('values---', { ...decodeNullValues(rest), symbolSessions: this.state.symbolSessions });

    const {
      notify,
      history,
      createSymbol,
    } = this.props;

    try {
      await createSymbol({
        variables: {
          args: {
            ...decodeNullValues(rest),
            marginMode: 'FOREX',
            isTest: true,
            symbolSessions: this.state.symbolSessions,
          },
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('TRADING_ENGINE.NEW_SYMBOL.SYMBOL'),
        message: I18n.t('TRADING_ENGINE.NEW_SYMBOL.NOTIFICATION.SUCCESS'),
      });

      history.push('/trading-engine-admin/symbols');
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('TRADING_ENGINE.NEW_SYMBOL.SYMBOL'),
        message: error.error === 'error.symbol.already.exist'
          ? I18n.t('TRADING_ENGINE.NEW_SYMBOL.NOTIFICATION.FAILED_EXIST')
          : I18n.t('TRADING_ENGINE.NEW_SYMBOL.NOTIFICATION.FAILED'),
      });
    }
  }

  updateSymbolSessionsState = (symbolSessions: SymbolSession[]) => {
    this.setState({ symbolSessions });
  }

  render() {
    const {
      symbolsQuery,
      securitiesQuery,
    } = this.props;

    const symbols = symbolsQuery.data?.tradingEngineSymbols || [];
    const securities = securitiesQuery.data?.tradingEngineSecurities || [];

    return (
      <div className="TradingEngineNewSymbol">
        <Formik
          enableReinitialize
          validateOnBlur={false}
          validateOnChange={false}
          validate={
            createValidator(
              {
                symbol: ['required'],
                source: ['required'],
                digits: ['required', 'numeric'],
                description: ['required'],
                securityName: ['required'],
                symbolType: ['required'],
                baseCurrency: ['required'],
                quoteCurrency: ['required'],
                background_color: ['required'],
                'swapConfigs.rollover': ['required'],
                'swapConfigs.type': ['required'],
                'filtration.filterSmoothing': ['required'],
                'filtration.softFilter': ['required'],
                'filtration.hardFilter': ['required'],
                bidSpread: ['required', 'numeric', 'min:-99999999999', 'max:999999999999'],
                askSpread: ['required', 'numeric', 'min:-99999999999', 'max:999999999999'],
                stopsLevel: ['required', 'numeric', 'min:1', 'max:100000'],
                'filtration.softFiltrationLevel': ['required', 'numeric', 'min:0', 'max:99999999999999999999'],
                'filtration.hardFiltrationLevel': ['required', 'numeric', 'min:0', 'max:99999999999999999999'],
                'filtration.discardFiltrationLevel': ['required', 'numeric', 'min:0', 'max:99999999999999999999'],
                lotSize: ['required', 'numeric', 'min:1', 'max:10000000000'],
                percentage: ['required', 'numeric', 'min:1', 'max:10000000000'],
                'swapConfigs.long': ['required', 'numeric', 'min:-10000000000', 'max:10000000000'],
                'swapConfigs.short': ['required', 'numeric', 'min:-10000000000', 'max:10000000000'],
              },
              {
                symbol: I18n.t('TRADING_ENGINE.NEW_SYMBOL.SYMBOL_LABEL'),
                source: I18n.t('TRADING_ENGINE.NEW_SYMBOL.SOURCE_LABEL'),
                digits: I18n.t('TRADING_ENGINE.NEW_SYMBOL.DIGITS_LABEL'),
                description: I18n.t('TRADING_ENGINE.NEW_SYMBOL.DESCRIPTION_LABEL'),
                securityName: I18n.t('TRADING_ENGINE.NEW_SYMBOL.SECURITY_LABEL'),
                symbolType: I18n.t('TRADING_ENGINE.NEW_SYMBOL.TYPE_LABEL'),
                baseCurrency: I18n.t('TRADING_ENGINE.NEW_SYMBOL.BASE_CURRENCY_LABEL'),
                quoteCurrency: I18n.t('TRADING_ENGINE.NEW_SYMBOL.QUOTE_CURRENCY_LABEL'),
                background: I18n.t('TRADING_ENGINE.NEW_SYMBOL.BACKGROUND_LABEL'),
                'swapConfigs.rollover': I18n.t('TRADING_ENGINE.NEW_SYMBOL.3_DAYS_SWAP_LABEL'),
                'swapConfigs.type': I18n.t('TRADING_ENGINE.NEW_SYMBOL.TYPE_LABEL'),
                'filtration.filterSmoothing': I18n.t('TRADING_ENGINE.NEW_SYMBOL.SMOOTHING'),
                'filtration.softFilter': I18n.t('TRADING_ENGINE.NEW_SYMBOL.FILTER'),
                'filtration.hardFilter': I18n.t('TRADING_ENGINE.NEW_SYMBOL.FILTER'),
                bidSpread: I18n.t('TRADING_ENGINE.NEW_SYMBOL.SPREAD_BID_LABEL'),
                askSpread: I18n.t('TRADING_ENGINE.NEW_SYMBOL.SPREAD_ASK_LABEL'),
                stopsLevel: I18n.t('TRADING_ENGINE.NEW_SYMBOL.LIMIT_STOP_LABEL'),
                'filtration.softFiltrationLevel': I18n.t('TRADING_ENGINE.NEW_SYMBOL.SOFT_FILTRATION_LEVEL'),
                'filtration.hardFiltrationLevel': I18n.t('TRADING_ENGINE.NEW_SYMBOL.HARD_FILTRATION_LEVEL'),
                'filtration.discardFiltrationLevel': I18n.t('TRADING_ENGINE.NEW_SYMBOL.DISCARD_FILTRATION_LEVEL'),
                lotSize: I18n.t('TRADING_ENGINE.NEW_SYMBOL.CONTRACT_SIZE_LABEL'),
                percentage: I18n.t('TRADING_ENGINE.NEW_SYMBOL.PERCENTAGE_LABEL'),
                'swapConfigs.long': I18n.t('TRADING_ENGINE.NEW_SYMBOL.LONG_POSITIONS_LABEL'),
                'swapConfigs.short': I18n.t('TRADING_ENGINE.NEW_SYMBOL.SHORT_POSITIONS_LABEL'),
              },
              false,
            )
          }
          initialValues={{
            digits: 4,
            symbolType: 'FOREX',
            baseCurrency: 'USD',
            quoteCurrency: 'USD',
            bidSpread: -10,
            askSpread: 10,
            stopsLevel: 10,
            lotSize: 100000,
            percentage: 100.0,
            marginCalculation: 'FOREX',
            profitCalculation: 'FOREX',
            swapConfigs: {
              enable: true,
              type: 'POINTS',
              long: 0.000000,
              short: 0.000000,
              rollover: 'WEDNESDAY',
            },
            filtration: {
              softFiltrationLevel: 0,
              softFilter: 0,
              hardFiltrationLevel: 0,
              hardFilter: 0,
              discardFiltrationLevel: 0,
              filterSmoothing: 0,
            },
          }}
          onSubmit={this.handleSubmit}
        >
          {({
            isSubmitting,
            setValues,
            values,
            dirty,
          }) => (
            <Form className="TradingEngineNewSymbol__content">
              <div className="TradingEngineNewSymbol__header">
                <span className="TradingEngineNewSymbol__title">
                  {I18n.t('TRADING_ENGINE.NEW_SYMBOL.SYMBOL')}
                </span>
                <div className="TradingEngineNewSymbol__actions">
                  <Button
                    type="submit"
                    className="TradingEngineNewSymbol__button"
                    small
                    primary
                    disabled={!dirty && !isSubmitting}
                  >
                    {I18n.t('COMMON.SAVE_CHANGES')}
                  </Button>
                </div>
              </div>

              <div className="TradingEngineNewSymbol__column">
                <SymbolSettings
                  symbols={symbols}
                  securities={securities}
                  values={values}
                  setValues={setValues}
                />
              </div>

              <div className="TradingEngineNewSymbol__column">
                <CalculationSettings />
              </div>

              <div className="TradingEngineNewSymbol__column">
                <SwapsSettings />
              </div>

              <div className="TradingEngineNewSymbol__column">
                <SessionsSettings
                  updateSymbolSessionsState={this.updateSymbolSessionsState}
                />
              </div>

              <div className="TradingEngineNewSymbol__column">
                <FiltrationSettings />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default compose(
  withNotifications,
  withRouter,
  withRequests({
    symbolsQuery: SymbolsQuery,
    securitiesQuery: SecuritiesQuery,
    createSymbol: CreateSymbolMutation,
  }),
)(TradingEngineNewSymbol);
