import React from 'react';
import I18n from 'i18n-js';
import { ChartTypes } from 'types/config';
import { Charts } from 'routes/Dashboard/types';
import useChart from 'routes/Dashboard/hooks/useChart';
import { useDepositCountQuery } from 'routes/Dashboard/graphql/__generated__/DepositCountQuery';
import ChartWidget from '../ChartWidget';

type Props = {
  chartType?: ChartTypes,
};

const DepositCountChart = (props: Props) => {
  const { chartType } = props;

  const {
    isChartLoading,
    isChartError,
    chartList,
    summaryList,
    handleSelectChange,
  } = useChart(useDepositCountQuery, Charts.depositCountStatistic);

  return (
    <ChartWidget
      title={I18n.t('DASHBOARD.DEPOSITS_COUNT_CHART.TITLE')}
      tooltipTitle={I18n.t('DASHBOARD.DEPOSITS_COUNT_CHART.TOOLTIP_TITLE')}
      data={chartList}
      summary={summaryList}
      loading={isChartLoading}
      noData={isChartError}
      onSelectChange={handleSelectChange}
      chartColor="var(--state-colors-success)"
      chartType={chartType}
    />
  );
};

export default React.memo(DepositCountChart);
