import React from 'react';
import I18n from 'i18n-js';
import { Types } from '@crm/common';
import { Charts } from 'routes/Dashboard/types';
import useChart from 'routes/Dashboard/hooks/useChart';
import { useFtrCountQuery } from 'routes/Dashboard/graphql/__generated__/FtrCountQuery';
import ChartWidget from '../ChartWidget';

type Props = {
  chartType?: Types.ChartTypes,
};

const FtrCountChart = (props: Props) => {
  const { chartType } = props;

  const {
    isChartLoading,
    isChartError,
    chartList,
    summaryList,
    handleSelectChange,
  } = useChart(useFtrCountQuery, Charts.ftrCountStatistic);

  return (
    <ChartWidget
      title={I18n.t('DASHBOARD.FTR_COUNT_CHART.TITLE')}
      tooltipTitle={I18n.t('DASHBOARD.FTR_COUNT_CHART.TOOLTIP_TITLE')}
      data={chartList}
      summary={summaryList}
      loading={isChartLoading}
      noData={isChartError}
      onSelectChange={handleSelectChange}
      chartColor="var(--state-colors-info)"
      chartType={chartType}
    />
  );
};

export default React.memo(FtrCountChart);
