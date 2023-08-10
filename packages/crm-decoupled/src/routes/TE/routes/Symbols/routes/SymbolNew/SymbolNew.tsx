import React, { useState } from 'react';
import { Formik, Form, FormikProps } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Utils, notify, LevelType, parseErrors } from '@crm/common';
import { Button } from 'components';
import I18n from 'i18n';
import { decodeNullValues } from 'components/Formik/utils';
import { LotMax, LotMin, LotStep } from 'routes/TE/routes/Groups/types';
import { DayOfWeek, SymbolType, SwapType, FormValues } from '../../types';
import SymbolSettings from '../../components/SymbolSettings';
import VolumeSettings from '../../components/VolumeSettings';
import CalculationSettings from '../../components/CalculationSettings';
import SwapsSettings from '../../components/SwapsSettings';
import SessionsSettings from '../../components/SessionsSettings';
import FiltrationSettings from '../../components/FiltrationSettings';
import { backgroundColor } from '../../constants';
import { useSecuritiesQuery } from './graphql/__generated__/SecuritiesQuery';
import { useSymbolsSourcesQuery } from './graphql/__generated__/SymbolsSourcesQuery';
import { SymbolQuery, useSymbolQueryLazyQuery } from './graphql/__generated__/SymbolQuery';
import { useCreateSymbolMutation, CreateSymbolMutationVariables } from './graphql/__generated__/CreateSymbolMutation';
import './SymbolNew.scss';

const SymbolNew = () => {
  const navigate = useNavigate();

  const [currentSourceSymbol, setCurrentSourceSymbol] = useState<SymbolQuery['tradingEngine']['symbol']>();

  const securitiesQuery = useSecuritiesQuery();
  const symbolsSourcesQuery = useSymbolsSourcesQuery();

  const [getSymbolQuery] = useSymbolQueryLazyQuery();
  const [createSymbol] = useCreateSymbolMutation();

  const symbolsSources = symbolsSourcesQuery.data?.tradingEngine.symbolsSources || [];
  const securities = securitiesQuery.data?.tradingEngine.securities || [];

  // ===== Handlers ===== //
  const handleSubmit = async (values: CreateSymbolMutationVariables['args']) => {
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

      navigate('/trading-engine/symbols');
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
  };

  return (
    <div className="SymbolNew">
      <Formik
        enableReinitialize
        validateOnBlur={false}
        validateOnChange={false}
        validate={
          Utils.createValidator(
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
              defaultFiltration: ['required'],
              bidSpread: ['required', 'numeric', 'min:-99999999999', 'max:999999999999'],
              askSpread: ['required', 'numeric', 'min:-99999999999', 'max:999999999999'],
              stopsLevel: ['required', 'integer', 'min:0', 'max:100000'],
              lotSize: ['required', 'numeric', 'min:1', 'max:10000000000'],
              lotMin: ['lessOrSame:lotMax'],
              lotMax: ['greaterOrSame:lotMin'],
              lotStep: ['lessOrSame:lotMin'],
              percentage: ['required', 'numeric', 'min:1', 'max:10000000000'],
              'filtration.filterSmoothing': ['required'],
              'filtration.softFilter': ['required'],
              'filtration.hardFilter': ['required'],
              'filtration.softFiltrationLevel': ['required', 'numeric', 'min:0', 'max:99999999999999999999'],
              'filtration.hardFiltrationLevel': ['required', 'numeric', 'min:0', 'max:99999999999999999999'],
              'filtration.discardFiltrationLevel': ['required', 'numeric', 'min:0', 'max:99999999999999999999'],
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
          lotMin: LotMin.MIN_0_01,
          lotMax: LotMax.MAX_100000_0,
          lotStep: LotStep.STEP_0_01,
          defaultFiltration: true,
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
        onSubmit={handleSubmit}
      >
        {(formik: FormikProps<FormValues>) => {
          // @ts-expect-error 'error' field inside symbolSessions from SessionsSettings component state
          const symbolSessionContainsErrors = formik.values?.symbolSessions.filter(({ error }) => error);

          // We don't need to send a source symbol object during the request(InitialValues)
          // so we changed the filtration values
          const handleDefaultFiltration = () => {
            formik.setValues({
              ...formik.values,
              defaultFiltration: !formik.values.defaultFiltration,
              filtration: {
                softFiltrationLevel: currentSourceSymbol?.filtration?.softFiltrationLevel || 0,
                softFilter: currentSourceSymbol?.filtration?.softFilter || 0,
                hardFiltrationLevel: currentSourceSymbol?.filtration?.hardFiltrationLevel || 0,
                hardFilter: currentSourceSymbol?.filtration?.hardFilter || 0,
                discardFiltrationLevel: currentSourceSymbol?.filtration?.discardFiltrationLevel || 0,
                filterSmoothing: currentSourceSymbol?.filtration?.filterSmoothing || 0,
              },
            });
          };

          // We need a value so that when switching the default of the checkbox,
          // we can reach the values of the source symbol
          const handleChangeSymbolSource = async (symbolName: string) => {
            const symbolQuery = await getSymbolQuery({ variables: { symbolName } });

            setCurrentSourceSymbol(symbolQuery?.data?.tradingEngine.symbol);

            formik.setValues({
              ...formik.values,
              ...symbolQuery.data?.tradingEngine.symbol,
              source: symbolName, // Repeat set symbol name here because "values" object doesn't have source field yet
              backgroundColor: backgroundColor[0]?.value, // Set field value before to avoid choosing backgroundColor
            });
          };

          return (
            <Form className="SymbolNew__content">
              <div className="SymbolNew__header">
                <span className="SymbolNew__title">
                  {I18n.t('TRADING_ENGINE.NEW_SYMBOL.TITLE')}
                </span>
                <div className="SymbolNew__actions">
                  <Button
                    type="submit"
                    className="SymbolNew__button"
                    data-testid="SymbolNew-saveChangesButton"
                    small
                    primary
                    disabled={(!formik.dirty && !formik.isSubmitting) || symbolSessionContainsErrors.length > 0}
                  >
                    {I18n.t('COMMON.SAVE_CHANGES')}
                  </Button>
                </div>
              </div>

              <div className="SymbolNew__column">
                <SymbolSettings
                  {...formik}
                  symbolsSources={symbolsSources}
                  securities={securities}
                  handleChangeSymbolSource={handleChangeSymbolSource}
                />
              </div>

              <div className="SymbolNew__column">
                <CalculationSettings
                  {...formik}
                />
              </div>

              <div className="SymbolNew__column">
                <VolumeSettings />
              </div>

              <div className="SymbolNew__column">
                <SwapsSettings />
              </div>

              <div className="SymbolNew__column">
                <SessionsSettings
                  {...formik}
                />
              </div>

              <div className="SymbolNew__column">
                <FiltrationSettings
                  {...formik}
                  handleDefaultFiltration={handleDefaultFiltration}
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default React.memo(SymbolNew);
