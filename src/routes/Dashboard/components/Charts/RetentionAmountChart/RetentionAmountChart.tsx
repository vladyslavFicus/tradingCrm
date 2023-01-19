import React from 'react';
import I18n from 'i18n-js';
import { getBrand } from 'config';
import { ChartTypes } from 'types/config';
import ChartWidget from '../ChartWidget';
import { DateRange } from '../ChartWidget/types';
import { chartInitialQueryParams } from '../ChartWidget/utils';
import { useRetentionAmountQuery } from './graphql/__generated__/RetentionAmountQuery';

type Props = {
  chartType?: ChartTypes,
};

const RetentionAmountChart = (props: Props) => {
  const { chartType } = props;

  // Initial variables
  const variables = chartInitialQueryParams();

  // ===== Requests ===== //
  const retentionAmountQuery = useRetentionAmountQuery({ variables, fetchPolicy: 'cache-and-network' });

  // ===== Handlers ===== //
  const handleSelectChange = (range: DateRange) => retentionAmountQuery.refetch({ ...variables, ...range });

  return (
    <ChartWidget
      title={I18n.t('DASHBOARD.RETENTIONS_AMOUNT_CHART.TITLE')}
      tooltipTitle={I18n.t('DASHBOARD.RETENTIONS_AMOUNT_CHART.TOOLTIP_TITLE')}
      data={retentionAmountQuery.data?.dashboard?.retentionAmountStatistic?.items || []}
      summary={retentionAmountQuery.data?.dashboard?.retentionAmountStatistic?.summary || []}
      loading={retentionAmountQuery.loading}
      noData={!!retentionAmountQuery.error}
      onSelectChange={handleSelectChange}
      chartColor="var(--state-colors-warning)"
      chartType={chartType}
      currncySymbol={getBrand().currencies?.base}
    />
  );
};

export default React.memo(RetentionAmountChart);
