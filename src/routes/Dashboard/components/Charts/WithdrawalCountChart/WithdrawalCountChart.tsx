import React from 'react';
import I18n from 'i18n-js';
import { ChartTypes } from 'types/config';
import ChartWidget from '../ChartWidget';
import { DateRange } from '../ChartWidget/types';
import { chartInitialQueryParams } from '../ChartWidget/utils';
import { useWithdrawalCountQuery } from './graphql/__generated__/WithdrawalCountQuery';

type Props = {
  chartType?: ChartTypes,
};

const WithdrawalCountChart = (props: Props) => {
  const { chartType } = props;

  // Initial variables
  const variables = chartInitialQueryParams();

  // ===== Requests ===== //
  const withdrawalCountQuery = useWithdrawalCountQuery({ variables, fetchPolicy: 'cache-and-network' });

  // ===== Handlers ===== //
  const handleSelectChange = (range: DateRange) => withdrawalCountQuery.refetch({ ...variables, ...range });

  return (
    <ChartWidget
      title={I18n.t('DASHBOARD.WITHDRAWALS_COUNT_CHART.TITLE')}
      tooltipTitle={I18n.t('DASHBOARD.WITHDRAWALS_COUNT_CHART.TOOLTIP_TITLE')}
      data={withdrawalCountQuery.data?.dashboard?.withdrawalCountStatistic?.items || []}
      summary={withdrawalCountQuery.data?.dashboard?.withdrawalCountStatistic?.summary || []}
      loading={withdrawalCountQuery.loading}
      noData={!!withdrawalCountQuery.error}
      onSelectChange={handleSelectChange}
      chartColor="var(--state-colors-danger)"
      chartType={chartType}
    />
  );
};

export default React.memo(WithdrawalCountChart);
