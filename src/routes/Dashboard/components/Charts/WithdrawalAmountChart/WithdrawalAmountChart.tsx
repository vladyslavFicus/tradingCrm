import React from 'react';
import I18n from 'i18n-js';
import { getBrand } from 'config';
import { ChartTypes } from 'types/config';
import ChartWidget from '../ChartWidget';
import { DateRange } from '../ChartWidget/types';
import { chartInitialQueryParams } from '../ChartWidget/utils';
import { useWithdrawalAmountQuery } from './graphql/__generated__/WithdrawalAmountQuery';

type Props = {
  chartType?: ChartTypes,
};

const WithdrawalAmountChart = (props: Props) => {
  const { chartType } = props;

  // Initial variables
  const variables = chartInitialQueryParams();

  // ===== Requests ===== //
  const withdrawalAmountQuery = useWithdrawalAmountQuery({ variables, fetchPolicy: 'cache-and-network' });

  // ===== Handlers ===== //
  const handleSelectChange = (range: DateRange) => withdrawalAmountQuery.refetch({ ...variables, ...range });

  return (
    <ChartWidget
      title={I18n.t('DASHBOARD.WITHDRAWALS_AMOUNT_CHART.TITLE')}
      tooltipTitle={I18n.t('DASHBOARD.WITHDRAWALS_AMOUNT_CHART.TOOLTIP_TITLE')}
      data={withdrawalAmountQuery.data?.dashboard?.withdrawalAmountStatistic?.items || []}
      summary={withdrawalAmountQuery.data?.dashboard?.withdrawalAmountStatistic?.summary || []}
      loading={withdrawalAmountQuery.loading}
      noData={!!withdrawalAmountQuery.error}
      onSelectChange={handleSelectChange}
      chartColor="var(--state-colors-danger)"
      chartType={chartType}
      currncySymbol={getBrand().currencies?.base}
    />
  );
};

export default React.memo(WithdrawalAmountChart);
