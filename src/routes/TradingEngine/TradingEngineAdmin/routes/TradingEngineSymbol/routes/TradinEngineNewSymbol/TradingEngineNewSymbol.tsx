import React, { PureComponent } from 'react';
import { Formik, Form, FormikProps } from 'formik';
import I18n from 'i18n';
import compose from 'compose-function';
import { parseErrors, withRequests } from 'apollo';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { BaseMutationOptions, MutationResult, QueryResult } from '@apollo/client';
import { withNotifications } from 'hoc';
import { createValidator } from 'utils/validator';
import { decodeNullValues } from 'components/Formik/utils';
import { Button } from 'components/UI';
import { Notify, LevelType } from 'types/notify';
import { DayOfWeek, SymbolType, SwapType, FormValues } from '../../../../types';
import SymbolSettings from '../../components/SymbolSettings';
import CalculationSettings from '../../components/CalculationSettings';
import SwapsSettings from '../../components/SwapsSettings';
import SessionsSettings from '../../components/SessionsSettings';
import FiltrationSettings from '../../components/FiltrationSettings';
import SymbolsSourcesQuery from './graphql/SymbolsSourcesQuery';
import SecuritiesQuery from './graphql/SecuritiesQuery';
import CreateSymbolMutation from './graphql/CreateSymbolMutation';
import './TradingEngineNewSymbol.scss';

interface CreateSymbolResponse {
  createSymbol: null,
}

interface SecurityData {
  tradingEngineSecurities: {
    name: string,
  }[],
}

interface SymbolSourcesData {
  tradingEngineAdminSymbolsSources: {
    sourceName: string,
  }[],
}

interface Props {
  notify: Notify,
  symbolsSourcesQuery: QueryResult<SymbolSourcesData>,
  securitiesQuery: QueryResult<SecurityData>,
  createSymbol: (options: BaseMutationOptions) => MutationResult<CreateSymbolResponse>,
}

class TradingEngineNewSymbol extends PureComponent<Props & RouteComponentProps> {
  handleSubmit = async (values: FormValues) => {
    const {
      notify,
      history,
      createSymbol,
    } = this.props;

    try {
      await createSymbol({
        variables: {
          args: decodeNullValues(values),
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('TRADING_ENGINE.NEW_SYMBOL.TITLE'),
        message: I18n.t('TRADING_ENGINE.NEW_SYMBOL.NOTIFICATION.SUCCESS'),
      });

      history.push('/trading-engine-admin/symbols');
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('TRADING_ENGINE.NEW_SYMBOL.TITLE'),
        message: error.error === 'error.symbol.already.exist'
          ? I18n.t('TRADING_ENGINE.NEW_SYMBOL.NOTIFICATION.FAILED_EXIST')
          : I18n.t('TRADING_ENGINE.NEW_SYMBOL.NOTIFICATION.FAILED'),
      });
    }
  }

  render() {
    const {
      symbolsSourcesQuery,
      securitiesQuery,
    } = this.props;

    const symbolsSources = symbolsSourcesQuery.data?.tradingEngineAdminSymbolsSources || [];
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
                baseCurrency: ({ symbolType }: FormValues) => [symbolType !== SymbolType.CFD && 'required'],
                quoteCurrency: ['required'],
                backgroundColor: ['required'],
                bidSpread: ['required', 'numeric', 'min:-99999999999', 'max:999999999999'],
                askSpread: ['required', 'numeric', 'min:-99999999999', 'max:999999999999'],
                stopsLevel: ['required', 'integer', 'min:1', 'max:100000'],
                lotSize: ['required', 'numeric', 'min:1', 'max:10000000000'],
                percentage: ['required', 'numeric', 'min:1', 'max:10000000000'],
                'filtration.filterSmoothing': ['required'],
                'filtration.softFilter': ['required'],
                'filtration.hardFilter': ['required'],
                'filtration.softFiltrationLevel': ['required', 'numeric', 'min:0', 'max:99999999999999999999'],
                'filtration.hardFiltrationLevel': ['required', 'numeric', 'min:0', 'max:99999999999999999999'],
                'filtration.discardFiltrationLevel': ['required', 'numeric', 'min:0', 'max:99999999999999999999'],
                'swapConfigs.rollover': ['required'],
                'swapConfigs.type': ['required'],
                'swapConfigs.long': ['required', 'numeric', 'min:-10000000000', 'max:10000000000'],
                'swapConfigs.short': ['required', 'numeric', 'min:-10000000000', 'max:10000000000'],
              },
              {
                symbol: I18n.t('TRADING_ENGINE.SYMBOL.SYMBOL_LABEL'),
                source: I18n.t('TRADING_ENGINE.SYMBOL.SOURCE_LABEL'),
                digits: I18n.t('TRADING_ENGINE.SYMBOL.DIGITS_LABEL'),
                description: I18n.t('TRADING_ENGINE.SYMBOL.DESCRIPTION_LABEL'),
                securityName: I18n.t('TRADING_ENGINE.SYMBOL.SECURITY_LABEL'),
                symbolType: I18n.t('TRADING_ENGINE.SYMBOL.TYPE_LABEL'),
                baseCurrency: I18n.t('TRADING_ENGINE.SYMBOL.BASE_CURRENCY_LABEL'),
                quoteCurrency: I18n.t('TRADING_ENGINE.SYMBOL.QUOTE_CURRENCY_LABEL'),
                backgroundColor: I18n.t('TRADING_ENGINE.SYMBOL.BACKGROUND_LABEL'),
                bidSpread: I18n.t('TRADING_ENGINE.SYMBOL.SPREAD_BID_LABEL'),
                askSpread: I18n.t('TRADING_ENGINE.SYMBOL.SPREAD_ASK_LABEL'),
                stopsLevel: I18n.t('TRADING_ENGINE.SYMBOL.LIMIT_STOP_LABEL'),
                lotSize: I18n.t('TRADING_ENGINE.SYMBOL.CONTRACT_SIZE_LABEL'),
                percentage: I18n.t('TRADING_ENGINE.SYMBOL.PERCENTAGE_LABEL'),
                'filtration.filterSmoothing': I18n.t('TRADING_ENGINE.SYMBOL.SMOOTHING'),
                'filtration.softFilter': I18n.t('TRADING_ENGINE.SYMBOL.FILTER'),
                'filtration.hardFilter': I18n.t('TRADING_ENGINE.SYMBOL.FILTER'),
                'filtration.softFiltrationLevel': I18n.t('TRADING_ENGINE.SYMBOL.SOFT_FILTRATION_LEVEL'),
                'filtration.hardFiltrationLevel': I18n.t('TRADING_ENGINE.SYMBOL.HARD_FILTRATION_LEVEL'),
                'filtration.discardFiltrationLevel': I18n.t('TRADING_ENGINE.SYMBOL.DISCARD_FILTRATION_LEVEL'),
                'swapConfigs.rollover': I18n.t('TRADING_ENGINE.SYMBOL.3_DAYS_SWAP_LABEL'),
                'swapConfigs.type': I18n.t('TRADING_ENGINE.SYMBOL.TYPE_LABEL'),
                'swapConfigs.long': I18n.t('TRADING_ENGINE.SYMBOL.LONG_POSITIONS_LABEL'),
                'swapConfigs.short': I18n.t('TRADING_ENGINE.SYMBOL.SHORT_POSITIONS_LABEL'),
              },
              false,
            )
          }
          initialValues={{
            symbol: '',
            source: '',
            description: '',
            backgroundColor: '',
            digits: 4,
            symbolType: SymbolType.FOREX,
            baseCurrency: 'USD',
            quoteCurrency: 'USD',
            bidSpread: -10,
            askSpread: 10,
            stopsLevel: 10,
            lotSize: 100000,
            percentage: 100.0,
            securityName: '',
            swapConfigs: {
              enable: true,
              type: SwapType.POINTS,
              long: 0.000000,
              short: 0.000000,
              rollover: DayOfWeek.WEDNESDAY,
            },
            filtration: {
              softFiltrationLevel: 0,
              softFilter: 0,
              hardFiltrationLevel: 0,
              hardFilter: 0,
              discardFiltrationLevel: 0,
              filterSmoothing: 0,
            },
            symbolSessions: [],
          }}
          onSubmit={this.handleSubmit}
        >
          {(formik: FormikProps<FormValues>) => {
            const symbolSessionContainsErrors = formik.values?.symbolSessions.filter(({ error }) => error);

            return (
              <Form className="TradingEngineNewSymbol__content">
                <div className="TradingEngineNewSymbol__header">
                  <span className="TradingEngineNewSymbol__title">
                    {I18n.t('TRADING_ENGINE.NEW_SYMBOL.TITLE')}
                  </span>
                  <div className="TradingEngineNewSymbol__actions">
                    <Button
                      type="submit"
                      className="TradingEngineNewSymbol__button"
                      small
                      primary
                      disabled={(!formik.dirty && !formik.isSubmitting) || symbolSessionContainsErrors.length > 0}
                    >
                      {I18n.t('COMMON.SAVE_CHANGES')}
                    </Button>
                  </div>
                </div>

                <div className="TradingEngineNewSymbol__column">
                  <SymbolSettings
                    symbolsSources={symbolsSources}
                    securities={securities}
                    {...formik}
                  />
                </div>

                <div className="TradingEngineNewSymbol__column">
                  <CalculationSettings
                    {...formik}
                  />
                </div>

                <div className="TradingEngineNewSymbol__column">
                  <SwapsSettings />
                </div>

                <div className="TradingEngineNewSymbol__column">
                  <SessionsSettings
                    {...formik}
                  />
                </div>

                <div className="TradingEngineNewSymbol__column">
                  <FiltrationSettings />
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    );
  }
}

export default compose(
  withNotifications,
  withRouter,
  withRequests({
    symbolsSourcesQuery: SymbolsSourcesQuery,
    securitiesQuery: SecuritiesQuery,
    createSymbol: CreateSymbolMutation,
  }),
)(TradingEngineNewSymbol);
