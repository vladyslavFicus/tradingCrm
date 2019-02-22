import React from 'react';
import { I18n } from 'react-redux-i18n';
import { tradingTypes, tradingStatuses } from 'constants/payment';
import { paymentsChartWrapper } from './utils';

const PaymentChart = paymentsChartWrapper(tradingTypes.DEPOSIT, tradingStatuses.MT4_COMPLETED);

const DepositsAmount = () => (
  <PaymentChart
    color="#1565d6"
    dataKey="amount"
    showFooterCurrency
    headerTitle={I18n.t('DASHBOARD.DEPOSITS_AMOUNT_CHART.TITLE')}
    tooltipСontent={I18n.t('DASHBOARD.DEPOSITS_AMOUNT_CHART.TOOLTIP_TITLE')}
    noResultsText={I18n.t('DASHBOARD.DEPOSITS_AMOUNT_CHART.NO_RESULTS_TEXT')}
  />
);

export default DepositsAmount;
