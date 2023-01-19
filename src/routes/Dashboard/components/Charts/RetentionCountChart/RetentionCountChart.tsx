import React from 'react';
import I18n from 'i18n-js';
import { ChartTypes } from 'types/config';
import ChartWidget from '../ChartWidget';
import { DateRange } from '../ChartWidget/types';
import { chartInitialQueryParams } from '../ChartWidget/utils';
import { useRetentionCountQuery } from './graphql/__generated__/RetentionCountQuery';

type Props = {
  chartType?: ChartTypes,
};

const RetentionCountChart = (props: Props) => {
  const { chartType } = props;

  // Initial variables
  const variables = chartInitialQueryParams();

  // ===== Requests ===== //
  const retentionCountQuery = useRetentionCountQuery({ variables, fetchPolicy: 'cache-and-network' });

  // ===== Handlers ===== //
  const handleSelectChange = (range: DateRange) => retentionCountQuery.refetch({ ...variables, ...range });

  return (
    <ChartWidget
      title={I18n.t('DASHBOARD.RETENTIONS_COUNT_CHART.TITLE')}
      tooltipTitle={I18n.t('DASHBOARD.RETENTIONS_COUNT_CHART.TOOLTIP_TITLE')}
      data={retentionCountQuery.data?.dashboard?.retentionCountStatistic?.items || []}
      summary={retentionCountQuery.data?.dashboard?.retentionCountStatistic?.summary || []}
      loading={retentionCountQuery.loading}
      noData={!!retentionCountQuery.error}
      onSelectChange={handleSelectChange}
      chartColor="var(--state-colors-warning)"
      chartType={chartType}
    />
  );
};

export default React.memo(RetentionCountChart);
