import React from 'react';
import I18n from 'i18n-js';
import { ChartTypes } from 'types/config';
import ChartWidget from '../ChartWidget';
import { DateRange } from '../ChartWidget/types';
import { chartInitialQueryParams } from '../ChartWidget/utils';
import { useDepositCountQuery } from './graphql/__generated__/DepositCountQuery';

type Props = {
  chartType?: ChartTypes,
};

const DepositCountChart = (props: Props) => {
  const { chartType } = props;

  // Initial variables
  const variables = chartInitialQueryParams();

  // ===== Requests ===== //
  const depositCountQuery = useDepositCountQuery({ variables, fetchPolicy: 'cache-and-network' });

  // ===== Handlers ===== //
  const handleSelectChange = (range: DateRange) => depositCountQuery.refetch({ ...variables, ...range });

  return (
    <ChartWidget
      title={I18n.t('DASHBOARD.DEPOSITS_COUNT_CHART.TITLE')}
      tooltipTitle={I18n.t('DASHBOARD.DEPOSITS_COUNT_CHART.TOOLTIP_TITLE')}
      data={depositCountQuery.data?.dashboard?.depositCountStatistic?.items || []}
      summary={depositCountQuery.data?.dashboard?.depositCountStatistic?.summary || []}
      loading={depositCountQuery.loading}
      noData={!!depositCountQuery.error}
      onSelectChange={handleSelectChange}
      chartColor="var(--state-colors-success)"
      chartType={chartType}
    />
  );
};

export default React.memo(DepositCountChart);
