import React from 'react';
import I18n from 'i18n-js';
import { Config, Types } from '@crm/common';
import { Charts } from 'routes/Dashboard/types';
import useChart from 'routes/Dashboard/hooks/useChart';
import { useFtdAmountQuery } from 'routes/Dashboard/graphql/__generated__/FtdAmountQuery';
import ChartWidget from '../ChartWidget';

type Props = {
  chartType?: Types.ChartTypes,
};

const FtdAmountChart = (props: Props) => {
  const { chartType } = props;

  const {
    isChartLoading,
    isChartError,
    chartList,
    summaryList,
    handleSelectChange,
  } = useChart(useFtdAmountQuery, Charts.ftdAmountStatistic);

  return (
    <ChartWidget
      title={I18n.t('DASHBOARD.FTD_AMOUNT_CHART.TITLE')}
      tooltipTitle={I18n.t('DASHBOARD.FTD_AMOUNT_CHART.TOOLTIP_TITLE')}
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

export default React.memo(FtdAmountChart);
