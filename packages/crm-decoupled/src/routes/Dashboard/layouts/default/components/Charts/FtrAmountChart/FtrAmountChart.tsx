import React from 'react';
import I18n from 'i18n-js';
import { getBrand } from 'config';
import { ChartTypes } from 'types/config';
import { Charts } from 'routes/Dashboard/types';
import useChart from 'routes/Dashboard/hooks/useChart';
import { useFtrAmountQuery } from 'routes/Dashboard/graphql/__generated__/FtrAmountQuery';
import ChartWidget from '../ChartWidget';

type Props = {
  chartType?: ChartTypes,
};

const FtrAmountChart = (props: Props) => {
  const { chartType } = props;

  const {
    isChartLoading,
    isChartError,
    chartList,
    summaryList,
    handleSelectChange,
  } = useChart(useFtrAmountQuery, Charts.ftrAmountStatistic);

  return (
    <ChartWidget
      title={I18n.t('DASHBOARD.FTR_AMOUNT_CHART.TITLE')}
      tooltipTitle={I18n.t('DASHBOARD.FTR_AMOUNT_CHART.TOOLTIP_TITLE')}
      data={chartList}
      summary={summaryList}
      loading={isChartLoading}
      noData={isChartError}
      onSelectChange={handleSelectChange}
      chartColor="var(--state-colors-info)"
      chartType={chartType}
      currncySymbol={getBrand().currencies?.base}
    />
  );
};

export default React.memo(FtrAmountChart);
