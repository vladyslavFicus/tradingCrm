import React from 'react';
import { I18n } from 'react-redux-i18n';
import { PaymentsChartWrapper } from './utils';

const DepositsAmount = () => (
  <PaymentsChartWrapper
    color="#1565d6"
    totalFieldName="totalDepositsAmount"
    dataKey="deposits.amount"
    headerTitle={I18n.t('DASHBOARD.DEPOSITS_AMOUNT_CHART.TITLE')}
    footerTitle={I18n.t('DASHBOARD.DEPOSITS_AMOUNT_CHART.FOOTER_TITLE')}
    tooltipСontent={I18n.t('DASHBOARD.DEPOSITS_AMOUNT_CHART.TOOLTIP_TITLE')}
    noResultsText={I18n.t('DASHBOARD.DEPOSITS_AMOUNT_CHART.NO_RESULTS_TEXT')}
  />
);

export default DepositsAmount;
