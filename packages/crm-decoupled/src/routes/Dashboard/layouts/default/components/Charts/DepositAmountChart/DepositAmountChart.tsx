import React from 'react';
import I18n from 'i18n-js';
import { Config, Types } from '@crm/common';
import useChart from 'routes/Dashboard/hooks/useChart';
import { Charts } from 'routes/Dashboard/types';
import { useDepositAmountQuery } from 'routes/Dashboard/graphql/__generated__/DepositAmountQuery';
import ChartWidget from '../ChartWidget';

type Props = {
  chartType?: Types.ChartTypes,
};

const DepositAmountChart = (props: Props) => {
  const { chartType } = props;

  const {
    isChartLoading,
    isChartError,
    chartList,
    summaryList,
    handleSelectChange,
  } = useChart(useDepositAmountQuery, Charts.depositAmountStatistic);

  return (
    <ChartWidget
      title={I18n.t('DASHBOARD.DEPOSITS_AMOUNT_CHART.TITLE')}
      tooltipTitle={I18n.t('DASHBOARD.DEPOSITS_AMOUNT_CHART.TOOLTIP_TITLE')}
      data={chartList}
      summary={summaryList}
      loading={isChartLoading}
      noData={isChartError}
      onSelectChange={handleSelectChange}
      chartColor="var(--state-colors-success)"
      chartType={chartType}
      currncySymbol={Config.getBrand().currencies?.base}
    />
  );
};

export default React.memo(DepositAmountChart);
