import React from 'react';
import { I18n } from 'react-redux-i18n';
import { PaymentsChartWrapper } from './utils';

const WithdrawsCount = () => (
  <PaymentsChartWrapper
    color="#ff7a21"
    totalFieldName="totalWithdrawsCount"
    dataKey="withdraws.count"
    headerTitle={I18n.t('DASHBOARD.WITHDRAWS_AMOUNT_CHART.TITLE')}
    footerTitle={I18n.t('DASHBOARD.WITHDRAWS_AMOUNT_CHART.FOOTER_TITLE')}
    tooltipСontent={I18n.t('DASHBOARD.WITHDRAWS_AMOUNT_CHART.TOOLTIP_TITLE')}
    noResultsText={I18n.t('DASHBOARD.WITHDRAWS_AMOUNT_CHART.NO_RESULTS_TEXT')}
  />
);

export default WithdrawsCount;
