import React from 'react';
import { Formik, Form, FormikProps, FormikHelpers } from 'formik';
import { useParams } from 'react-router-dom';
import { Utils } from '@crm/common';
import { Button, ShortLoader } from 'components';
import I18n from 'i18n';
import { parseErrors } from 'apollo';
import NotFound from 'routes/NotFound';
import { decodeNullValues } from 'components/Formik/utils';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { notify, LevelType } from 'providers/NotificationProvider';
import { useModal } from 'providers/ModalProvider';
import { LotMax, LotMin, LotStep } from 'routes/TE/routes/Groups/types';
import SymbolSettings from '../../components/SymbolSettings';
import CalculationSettings from '../../components/CalculationSettings';
import SwapsSettings from '../../components/SwapsSettings';
import VolumeSettings from '../../components/VolumeSettings';
import SessionsSettings from '../../components/SessionsSettings';
import FiltrationSettings from '../../components/FiltrationSettings';
import { FormValues, SwapType, SymbolType } from '../../types';
import { useSymbolQuery } from './graphql/__generated__/SymbolQuery';
import { useSecuritiesQuery } from './graphql/__generated__/SecuritiesQuery';
import { useSymbolsSourcesQuery } from './graphql/__generated__/SymbolsSourcesQuery';
import { useEditSymbolMutation } from './graphql/__generated__/EditSymbolMutation';
import './SymbolEdit.scss';

const validator = Utils.createValidator(
  {
    symbol: ['required'],
    digits: ['required', 'numeric'],
    description: ['required'],
    securityName: ['required'],
    symbolType: ['required'],
    defaultFiltration: ['required'],
    baseCurrency: ({ symbolType }: FormValues) => [symbolType !== SymbolType.CFD && 'required'],
    quoteCurrency: ['required'],
    backgroundColor: ['required'],
    bidSpread: ['required', 'numeric', 'min:-99999999999', 'max:999999999999'],
    askSpread: ['required', 'numeric', 'min:-99999999999', 'max:999999999999'],
    stopsLevel: ['required', 'integer', 'min:0', 'max:100000'],
    lotSize: ['required', 'numeric', 'min:1', 'max:10000000000'],
    percentage: ['required', 'numeric', 'min:1', 'max:10000000000'],
    lotMin: ['lessOrSame:lotMax'],
    lotMax: ['greaterOrSame:lotMin'],
    lotStep: ['lessOrSame:lotMin'],
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
);

const SymbolEdit = () => {
  const id = useParams().id as string;

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

  const symbolQuery = useSymbolQuery({ variables: { symbolName: id } });
  const securitiesQuery = useSecuritiesQuery();
  const symbolsSourcesQuery = useSymbolsSourcesQuery();

  const [editSymbol] = useEditSymbolMutation();

  const symbolsSources = symbolsSourcesQuery.data?.tradingEngine.symbolsSources || [];
  const securities = securitiesQuery.data?.tradingEngine.securities || [];
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
    lotMin,
    lotMax,
    lotStep,
    percentage,
    securityName,
    swapConfigs,
    filtration,
    sourceSymbol,
    symbolSessions,
    defaultFiltration,
  } = symbolQuery.data?.tradingEngine.symbol || {};

  // ==== Handlers ==== //
  const handleSubmit = async (values: FormValues, formik: FormikHelpers<FormValues>, force = false) => {
    try {
      await editSymbol({
        variables: {
          args: decodeNullValues({ ...values, force }),
        },
      });

      await symbolQuery.refetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('TRADING_ENGINE.EDIT_SYMBOL.TITLE'),
        message: I18n.t('TRADING_ENGINE.EDIT_SYMBOL.NOTIFICATION.SUCCESS'),
      });
    } catch (e) {
      const error = parseErrors(e);

      // Open confirmation modal to confirm force closing orders
      if (error.error === 'error.symbol.has.opened.orders') {
        confirmActionModal.show({
          actionText: I18n.t('TRADING_ENGINE.EDIT_SYMBOL.NOTIFICATION.FAILED_SYMBOL_HAS_ORDERS'),
          submitButtonLabel: I18n.t('COMMON.YES'),
          cancelButtonLabel: I18n.t('COMMON.NO'),
          onSubmit: () => handleSubmit(values, formik, true),
        });
      } else {
        notify({
          level: LevelType.ERROR,
          title: I18n.t('TRADING_ENGINE.EDIT_SYMBOL.TITLE'),
          message: I18n.t('TRADING_ENGINE.EDIT_SYMBOL.NOTIFICATION.FAILED'),
        });
      }
    }
  };

  // Return not found if BE response is "error.symbol.not.found"
  if (parseErrors(symbolQuery.error).error === 'error.symbol.not.found') {
    return <NotFound />;
  }

  return (
    <div className="SymbolEdit">
      <Choose>
        <When condition={symbolQuery.loading}>
          <ShortLoader className="SymbolEdit__loading" />
        </When>
        <Otherwise>
          <Formik
            enableReinitialize
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
              lotMin: lotMin || LotMin.MIN_0_01,
              lotMax: lotMax || LotMax.MAX_100000_0,
              lotStep: lotStep || LotStep.STEP_0_01,
              swapConfigs: {
                enable: swapConfigs?.enable || false,
                type: swapConfigs?.type || SwapType.POINTS,
                long: swapConfigs?.long || 0.000000,
                short: swapConfigs?.short || 0.000000,
                swapDayTimes: swapConfigs?.swapDayTimes,
              },
              defaultFiltration,
              filtration: {
                softFiltrationLevel: filtration?.softFiltrationLevel || 0,
                softFilter: filtration?.softFilter || 0,
                hardFiltrationLevel: filtration?.hardFiltrationLevel || 0,
                hardFilter: filtration?.hardFilter || 0,
                discardFiltrationLevel: filtration?.discardFiltrationLevel || 0,
                filterSmoothing: filtration?.filterSmoothing || 0,
              },
              symbolSessions: symbolSessions || [],
            } as FormValues}
            onSubmit={handleSubmit}
          >
            {(formik: FormikProps<FormValues>) => {
              // @ts-expect-error 'error' field inside symbolSessions from SessionsSettings component state
              const symbolSessionContainsErrors = formik.values?.symbolSessions.filter(({ error }) => error);

              // We don't need to send a source symbol object during the request(InitialValues)
              // so we changed the filtration values
              const handleDefaultFiltration = () => {
                if (formik.values.defaultFiltration) {
                  formik.setValues({
                    ...formik.values,
                    filtration: formik.initialValues.filtration,
                    defaultFiltration: false,
                  });
                } else {
                  formik.setValues({
                    ...formik.values,
                    defaultFiltration: true,
                    filtration: {
                      softFiltrationLevel: sourceSymbol?.filtration?.softFiltrationLevel || 0,
                      softFilter: sourceSymbol?.filtration?.softFilter || 0,
                      hardFiltrationLevel: sourceSymbol?.filtration?.hardFiltrationLevel || 0,
                      hardFilter: sourceSymbol?.filtration?.hardFilter || 0,
                      discardFiltrationLevel: sourceSymbol?.filtration?.discardFiltrationLevel || 0,
                      filterSmoothing: sourceSymbol?.filtration?.filterSmoothing || 0,
                    },
                  });
                }
              };

              return (
                <Form className="SymbolEdit__content">
                  <div className="SymbolEdit__header">
                    <span className="SymbolEdit__title">
                      {I18n.t('TRADING_ENGINE.EDIT_SYMBOL.TITLE')}
                    </span>
                    <div className="SymbolEdit__info-message">
                      <Choose>
                        <When condition={!!source}>
                          {I18n.t('TRADING_ENGINE.EDIT_SYMBOL.INFO_MESSAGE.DEPENDENT_SYMBOL')}
                        </When>
                        <Otherwise>
                          {I18n.t('TRADING_ENGINE.EDIT_SYMBOL.INFO_MESSAGE.SOURCE_SYMBOL')}
                        </Otherwise>
                      </Choose>
                    </div>
                    <div className="SymbolEdit__actions">
                      <Button
                        type="submit"
                        className="SymbolEdit__button"
                        data-testid="SymbolEdit-saveChangesButton"
                        small
                        primary
                        disabled={
                          !formik.dirty
                          || formik.isSubmitting
                          || !formik.isValid
                          || symbolSessionContainsErrors.length > 0
                        }
                      >
                        {I18n.t('COMMON.SAVE_CHANGES')}
                      </Button>
                    </div>
                  </div>

                  <div className="SymbolEdit__column">
                    <SymbolSettings
                      {...formik}
                      symbolsSources={symbolsSources}
                      securities={securities}
                    />
                  </div>

                  <div className="SymbolEdit__column">
                    <VolumeSettings />
                  </div>

                  <div className="SymbolEdit__column">
                    <CalculationSettings
                      {...formik}
                    />
                  </div>

                  <div className="SymbolEdit__column">
                    <SwapsSettings />
                  </div>

                  <div className="SymbolEdit__column">
                    <SessionsSettings
                      {...formik}
                    />
                  </div>

                  <div className="SymbolEdit__column">
                    <FiltrationSettings
                      {...formik}
                      handleDefaultFiltration={handleDefaultFiltration}
                    />
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Otherwise>
      </Choose>
    </div>
  );
};

export default React.memo(SymbolEdit);
