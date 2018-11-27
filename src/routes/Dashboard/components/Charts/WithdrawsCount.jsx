import React from 'react';
import { I18n } from 'react-redux-i18n';
import { PaymentsChartWrapper } from './utils';

const WithdrawsCount = () => (
  <PaymentsChartWrapper
    color="#ff7a21"
    totalFieldName="totalWithdrawsCount"
    dataKey="withdraws.count"
    headerTitle={I18n.t('DASHBOARD.WITHDRAWS_COUNT_CHART.TITLE')}
    tooltipСontent={I18n.t('DASHBOARD.WITHDRAWS_COUNT_CHART.TOOLTIP_TITLE')}
    noResultsText={I18n.t('DASHBOARD.WITHDRAWS_COUNT_CHART.NO_RESULTS_TEXT')}
  />
);

export default WithdrawsCount;
