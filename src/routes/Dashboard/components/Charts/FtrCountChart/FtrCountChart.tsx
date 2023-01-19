import React from 'react';
import I18n from 'i18n-js';
import { ChartTypes } from 'types/config';
import ChartWidget from '../ChartWidget';
import { DateRange } from '../ChartWidget/types';
import { chartInitialQueryParams } from '../ChartWidget/utils';
import { useFtrCountQuery } from './graphql/__generated__/FtrCountQuery';

type Props = {
  chartType?: ChartTypes,
};

const FtrCountChart = (props: Props) => {
  const { chartType } = props;

  // Initial variables
  const variables = chartInitialQueryParams();

  // ===== Requests ===== //
  const ftrCountQuery = useFtrCountQuery({ variables, fetchPolicy: 'cache-and-network' });

  // ===== Handlers ===== //
  const handleSelectChange = (range: DateRange) => ftrCountQuery.refetch({ ...variables, ...range });

  return (
    <ChartWidget
      title={I18n.t('DASHBOARD.FTR_COUNT_CHART.TITLE')}
      tooltipTitle={I18n.t('DASHBOARD.FTR_COUNT_CHART.TOOLTIP_TITLE')}
      data={ftrCountQuery.data?.dashboard?.ftrCountStatistic?.items || []}
      summary={ftrCountQuery.data?.dashboard?.ftrCountStatistic?.summary || []}
      loading={ftrCountQuery.loading}
      noData={!!ftrCountQuery.error}
      onSelectChange={handleSelectChange}
      chartColor="var(--state-colors-info)"
      chartType={chartType}
    />
  );
};

export default React.memo(FtrCountChart);
