import React from 'react';
import I18n from 'i18n-js';
import { getBrand } from 'config';
import { ChartTypes } from 'types/config';
import ChartWidget from '../ChartWidget';
import { DateRange } from '../ChartWidget/types';
import { chartInitialQueryParams } from '../ChartWidget/utils';
import { useDepositAmountQuery } from './graphql/__generated__/DepositAmountQuery';

type Props = {
  chartType?: ChartTypes,
};

const DepositAmountChart = (props: Props) => {
  const { chartType } = props;

  // Initial variables
  const variables = chartInitialQueryParams();

  // ===== Requests ===== //
  const depositAmountQuery = useDepositAmountQuery({ variables, fetchPolicy: 'cache-and-network' });

  // ===== Handlers ===== //
  const handleSelectChange = (range: DateRange) => depositAmountQuery.refetch({ ...variables, ...range });

  return (
    <ChartWidget
      title={I18n.t('DASHBOARD.DEPOSITS_AMOUNT_CHART.TITLE')}
      tooltipTitle={I18n.t('DASHBOARD.DEPOSITS_AMOUNT_CHART.TOOLTIP_TITLE')}
      data={depositAmountQuery.data?.dashboard?.depositAmountStatistic?.items || []}
      summary={depositAmountQuery.data?.dashboard?.depositAmountStatistic?.summary || []}
      loading={depositAmountQuery.loading}
      noData={!!depositAmountQuery.error}
      onSelectChange={handleSelectChange}
      chartColor="var(--state-colors-success)"
      chartType={chartType}
      currncySymbol={getBrand().currencies?.base}
    />
  );
};

export default React.memo(DepositAmountChart);
