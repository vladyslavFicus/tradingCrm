import React from 'react';
import { I18n } from 'react-redux-i18n';
import { PaymentsChartWrapper } from './utils';

const DepositsCount = () => (
  <PaymentsChartWrapper
    color="#1565d6"
    totalFieldName="totalDepositsCount"
    dataKey="deposits.count"
    headerTitle={I18n.t('DASHBOARD.DEPOSITS_COUNT_CHART.TITLE')}
    tooltipСontent={I18n.t('DASHBOARD.DEPOSITS_COUNT_CHART.TOOLTIP_TITLE')}
    noResultsText={I18n.t('DASHBOARD.DEPOSITS_COUNT_CHART.NO_RESULTS_TEXT')}
  />
);

export default DepositsCount;
