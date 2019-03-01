import React from 'react';
import { I18n } from 'react-redux-i18n';
import { tradingTypes, tradingStatuses } from 'constants/payment';
import { paymentsChartWrapper } from './utils';

const PaymentChart = paymentsChartWrapper(tradingTypes.DEPOSIT, tradingStatuses.MT4_COMPLETED);

const DepositsCount = () => (
  <PaymentChart
    color="#1565d6"
    dataKey="count"
    headerTitle={I18n.t('DASHBOARD.DEPOSITS_COUNT_CHART.TITLE')}
    tooltipContent={I18n.t('DASHBOARD.DEPOSITS_COUNT_CHART.TOOLTIP_TITLE')}
    noResultsText={I18n.t('DASHBOARD.DEPOSITS_COUNT_CHART.NO_RESULTS_TEXT')}
  />
);

export default DepositsCount;
