import React from 'react';
import I18n from 'i18n-js';
import { ChartTypes } from 'types/config';
import ChartWidget from '../ChartWidget';
import { DateRange } from '../ChartWidget/types';
import { chartInitialQueryParams } from '../ChartWidget/utils';
import { useFtdCountQuery } from './graphql/__generated__/FtdCountQuery';

type Props = {
  chartType?: ChartTypes,
};

const FtdCountChart = (props: Props) => {
  const { chartType } = props;

  // Initial variables
  const variables = chartInitialQueryParams();

  // ===== Requests ===== //
  const ftdCountQuery = useFtdCountQuery({ variables, fetchPolicy: 'cache-and-network' });

  // ===== Handlers ===== //
  const handleSelectChange = (range: DateRange) => ftdCountQuery.refetch({ ...variables, ...range });

  return (
    <ChartWidget
      title={I18n.t('DASHBOARD.FTD_COUNT_CHART.TITLE')}
      tooltipTitle={I18n.t('DASHBOARD.FTD_COUNT_CHART.TOOLTIP_TITLE')}
      data={ftdCountQuery.data?.dashboard?.ftdCountStatistic?.items || []}
      summary={ftdCountQuery.data?.dashboard?.ftdCountStatistic?.summary || []}
      loading={ftdCountQuery.loading}
      noData={!!ftdCountQuery.error}
      onSelectChange={handleSelectChange}
      chartColor="var(--state-colors-success)"
      chartType={chartType}
    />
  );
};

export default React.memo(FtdCountChart);
