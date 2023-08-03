import React from 'react';
import I18n from 'i18n-js';
import { ChartTypes } from 'types/config';
import { Charts } from 'routes/Dashboard/types';
import useChart from 'routes/Dashboard/hooks/useChart';
import { useRegistrationsQuery } from 'routes/Dashboard/graphql/__generated__/RegistrationsQuery';
import ChartWidget from '../ChartWidget';

type Props = {
  chartType?: ChartTypes,
};

const RegistrationsChart = (props: Props) => {
  const { chartType } = props;

  const {
    isChartLoading,
    isChartError,
    chartList,
    summaryList,
    handleSelectChange,
  } = useChart(useRegistrationsQuery, Charts.registrationStatistic);

  return (
    <ChartWidget
      title={I18n.t('DASHBOARD.REGISTRATION_CHART.TITLE')}
      tooltipTitle={I18n.t('DASHBOARD.REGISTRATION_CHART.TOOLTIP_TITLE')}
      data={chartList}
      summary={summaryList}
      loading={isChartLoading}
      noData={isChartError}
      onSelectChange={handleSelectChange}
      chartColor="var(--state-colors-warning)"
      chartType={chartType}
    />
  );
};

export default React.memo(RegistrationsChart);
