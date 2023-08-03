import React from 'react';
import I18n from 'i18n-js';
import { getBrand } from 'config';
import { ChartTypes } from 'types/config';
import { Charts } from 'routes/Dashboard/types';
import useChart from 'routes/Dashboard/hooks/useChart';
import { useRetentionAmountQuery } from 'routes/Dashboard/graphql/__generated__/RetentionAmountQuery';
import ChartWidget from '../ChartWidget';

type Props = {
  chartType?: ChartTypes,
};

const RetentionAmountChart = (props: Props) => {
  const { chartType } = props;

  const {
    isChartLoading,
    isChartError,
    chartList,
    summaryList,
    handleSelectChange,
  } = useChart(useRetentionAmountQuery, Charts.retentionAmountStatistic);

  return (
    <ChartWidget
      title={I18n.t('DASHBOARD.RETENTIONS_AMOUNT_CHART.TITLE')}
      tooltipTitle={I18n.t('DASHBOARD.RETENTIONS_AMOUNT_CHART.TOOLTIP_TITLE')}
      data={chartList}
      summary={summaryList}
      loading={isChartLoading}
      noData={isChartError}
      onSelectChange={handleSelectChange}
      chartColor="var(--state-colors-warning)"
      chartType={chartType}
      currncySymbol={getBrand().currencies?.base}
    />
  );
};

export default React.memo(RetentionAmountChart);
