import React from 'react';
import I18n from 'i18n-js';
import { getBrand } from 'config';
import { ChartTypes } from 'types/config';
import ChartWidget from '../ChartWidget';
import { DateRange } from '../ChartWidget/types';
import { chartInitialQueryParams } from '../ChartWidget/utils';
import { useFtrAmountQuery } from './graphql/__generated__/FtrAmountQuery';

type Props = {
  chartType?: ChartTypes,
};

const FtrAmountChart = (props: Props) => {
  const { chartType } = props;

  // Initial variables
  const variables = chartInitialQueryParams();

  // ===== Requests ===== //
  const ftrAmountQuery = useFtrAmountQuery({ variables, fetchPolicy: 'cache-and-network' });

  // ===== Handlers ===== //
  const handleSelectChange = (range: DateRange) => ftrAmountQuery.refetch({ ...variables, ...range });

  return (
    <ChartWidget
      title={I18n.t('DASHBOARD.FTR_AMOUNT_CHART.TITLE')}
      tooltipTitle={I18n.t('DASHBOARD.FTR_AMOUNT_CHART.TOOLTIP_TITLE')}
      data={ftrAmountQuery.data?.dashboard?.ftrAmountStatistic?.items || []}
      summary={ftrAmountQuery.data?.dashboard?.ftrAmountStatistic?.summary || []}
      loading={ftrAmountQuery.loading}
      noData={!!ftrAmountQuery.error}
      onSelectChange={handleSelectChange}
      chartColor="var(--state-colors-info)"
      chartType={chartType}
      currncySymbol={getBrand().currencies?.base}
    />
  );
};

export default React.memo(FtrAmountChart);
