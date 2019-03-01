import React from 'react';
import { I18n } from 'react-redux-i18n';
import { tradingTypes, tradingStatuses } from 'constants/payment';
import { paymentsChartWrapper } from './utils';

const PaymentChart = paymentsChartWrapper(tradingTypes.WITHDRAW, tradingStatuses.MT4_COMPLETED);

const WithdrawsCount = () => (
  <PaymentChart
    color="#ff7a21"
    dataKey="count"
    headerTitle={I18n.t('DASHBOARD.WITHDRAWS_COUNT_CHART.TITLE')}
    tooltipContent={I18n.t('DASHBOARD.WITHDRAWS_COUNT_CHART.TOOLTIP_TITLE')}
    noResultsText={I18n.t('DASHBOARD.WITHDRAWS_COUNT_CHART.NO_RESULTS_TEXT')}
  />
);

export default WithdrawsCount;
