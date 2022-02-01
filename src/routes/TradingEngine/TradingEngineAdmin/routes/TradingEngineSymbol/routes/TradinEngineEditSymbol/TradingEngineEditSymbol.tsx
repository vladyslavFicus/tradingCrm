import React, { PureComponent } from 'react';
import { Formik, Form, FormikProps } from 'formik';
import I18n from 'i18n';
import compose from 'compose-function';
import { withRequests } from 'apollo';
import { RouteComponentProps } from 'react-router-dom';
import { MutationResult, MutationOptions, QueryResult } from 'react-apollo';
import { withNotifications } from 'hoc';
import { createValidator } from 'utils/validator';
import ShortLoader from 'components/ShortLoader';
import { decodeNullValues } from 'components/Formik/utils';
import { Button } from 'components/UI';
import { Notify, LevelType } from 'types/notify';
import SymbolSettings from '../../components/SymbolSettings';
import CalculationSettings from '../../components/CalculationSettings';
import SwapsSettings from '../../components/SwapsSettings';
import SessionsSettings from '../../components/SessionsSettings';
import FiltrationSettings from '../../components/FiltrationSettings';
import { DayOfWeek, FormValues, SwapType, SymbolType } from '../../../../types';
import SymbolsSourcesQuery from './graphql/SymbolsSourcesQuery';
import SecuritiesQuery from './graphql/SecuritiesQuery';
import EditSymbolMutation from './graphql/EditSymbolMutation';
import SymbolQuery from './graphql/SymbolQuery';
import './TradingEngineEditSymbol.scss';

interface CreateSymbolResponse {
  editSymbol: null,
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

interface SymbolsData {
  tradingEngineAdminSymbol: FormValues,
}

interface Props extends RouteComponentProps {
  notify: Notify,
  symbolsSourcesQuery: QueryResult<SymbolSourcesData>,
  securitiesQuery: QueryResult<SecurityData>,
  symbolQuery: QueryResult<SymbolsData>,
  editSymbol: (options: MutationOptions) => MutationResult<CreateSymbolResponse>,
}

const validator = createValidator(
  {
    symbol: ['required'],
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
);

class TradingEngineEditSymbol extends PureComponent<Props> {
  handleSubmit = async (values: FormValues) => {
    const {
      notify,
      editSymbol,
    } = this.props;

    try {
      await editSymbol({
        variables: {
          args: decodeNullValues(values),
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('TRADING_ENGINE.EDIT_SYMBOL.TITLE'),
        message: I18n.t('TRADING_ENGINE.EDIT_SYMBOL.NOTIFICATION.SUCCESS'),
      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('TRADING_ENGINE.EDIT_SYMBOL.TITLE'),
        message: I18n.t('TRADING_ENGINE.EDIT_SYMBOL.NOTIFICATION.FAILED'),
      });
    }
  }

  render() {
    const {
      symbolsSourcesQuery,
      securitiesQuery,
      symbolQuery,
    } = this.props;

    const symbolsSources = symbolsSourcesQuery.data?.tradingEngineAdminSymbolsSources || [];
    const securities = securitiesQuery.data?.tradingEngineSecurities || [];
    const {
      symbol,
      source,
      description,
      backgroundColor,
      digits,
      symbolType,
      baseCurrency,
      quoteCurrency,
      bidSpread,
      askSpread,
      stopsLevel,
      lotSize,
      percentage,
      securityName,
      swapConfigs,
      filtration,
      symbolSessions,
    } = symbolQuery.data?.tradingEngineAdminSymbol || {};

    return (
      <div className="TradingEngineEditSymbol">
        <Choose>
          <When condition={symbolQuery.loading}>
            <ShortLoader className="TradingEngineEditSymbol__loading" />
          </When>
          <Otherwise>
            <Formik
              enableReinitialize
              validateOnBlur={false}
              validateOnChange={false}
              validate={validator}
              initialValues={{
                symbol: symbol || '',
                source: source || '',
                description: description || '',
                backgroundColor: backgroundColor || '',
                digits: digits || 0,
                symbolType: symbolType || SymbolType.FOREX,
                baseCurrency: baseCurrency || '',
                quoteCurrency: quoteCurrency || '',
                bidSpread: bidSpread || 0,
                askSpread: askSpread || 0,
                stopsLevel: stopsLevel || 0,
                lotSize: lotSize || 0,
                percentage: percentage || 0,
                securityName: securityName || '',
                swapConfigs: {
                  enable: swapConfigs?.enable || false,
                  type: swapConfigs?.type || SwapType.POINTS,
                  long: swapConfigs?.long || 0.000000,
                  short: swapConfigs?.short || 0.000000,
                  rollover: swapConfigs?.rollover || DayOfWeek.WEDNESDAY,
                },
                filtration: {
                  softFiltrationLevel: filtration?.softFiltrationLevel || 0,
                  softFilter: filtration?.softFilter || 0,
                  hardFiltrationLevel: filtration?.hardFiltrationLevel || 0,
                  hardFilter: filtration?.hardFilter || 0,
                  discardFiltrationLevel: filtration?.discardFiltrationLevel || 0,
                  filterSmoothing: filtration?.filterSmoothing || 0,
                },
                symbolSessions: symbolSessions || [],
              }}
              onSubmit={this.handleSubmit}
            >
              {(formik : FormikProps<FormValues>) => {
                const symbolSessionContainsErrors = formik.values?.symbolSessions.filter(({ error }) => error);

                return (
                  <Form className="TradingEngineEditSymbol__content">
                    <div className="TradingEngineEditSymbol__header">
                      <span className="TradingEngineEditSymbol__title">
                        {I18n.t('TRADING_ENGINE.EDIT_SYMBOL.TITLE')}
                      </span>
                      <div className="TradingEngineEditSymbol__info-message">
                        <Choose>
                          <When condition={symbolsSources.length > 0}>
                            {I18n.t('TRADING_ENGINE.EDIT_SYMBOL.INFO_MESSAGE.DEPENDENT_SYMBOL')}
                          </When>
                          <Otherwise>
                            {I18n.t('TRADING_ENGINE.EDIT_SYMBOL.INFO_MESSAGE.SOURCE_SYMBOL')}
                          </Otherwise>
                        </Choose>
                      </div>
                      <div className="TradingEngineEditSymbol__actions">
                        <Button
                          type="submit"
                          className="TradingEngineEditSymbol__button"
                          small
                          primary
                          disabled={(!formik.dirty && !formik.isSubmitting) || symbolSessionContainsErrors.length > 0}
                        >
                          {I18n.t('COMMON.SAVE_CHANGES')}
                        </Button>
                      </div>
                    </div>

                    <div className="TradingEngineEditSymbol__column">
                      <SymbolSettings
                        symbolsSources={symbolsSources}
                        securities={securities}
                        {...formik}
                      />
                    </div>

                    <div className="TradingEngineEditSymbol__column">
                      <CalculationSettings
                        {...formik}
                      />
                    </div>

                    <div className="TradingEngineEditSymbol__column">
                      <SwapsSettings />
                    </div>

                    <div className="TradingEngineEditSymbol__column">
                      <SessionsSettings
                        {...formik}
                      />
                    </div>

                    <div className="TradingEngineEditSymbol__column">
                      <FiltrationSettings />
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </Otherwise>
        </Choose>
      </div>
    );
  }
}

export default compose(
  withNotifications,
  withRequests({
    symbolsSourcesQuery: SymbolsSourcesQuery,
    securitiesQuery: SecuritiesQuery,
    editSymbol: EditSymbolMutation,
    symbolQuery: SymbolQuery,
  }),
)(TradingEngineEditSymbol);
