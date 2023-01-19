import React from 'react';
import I18n from 'i18n-js';
import { getBrand } from 'config';
import { ChartTypes } from 'types/config';
import ChartWidget from '../ChartWidget';
import { DateRange } from '../ChartWidget/types';
import { chartInitialQueryParams } from '../ChartWidget/utils';
import { useFtdAmountQuery } from './graphql/__generated__/FtdAmountQuery';

type Props = {
  chartType?: ChartTypes,
};

const FtdAmountChart = (props: Props) => {
  const { chartType } = props;

  // Initial variables
  const variables = chartInitialQueryParams();

  // ===== Requests ===== //
  const ftdAmountQuery = useFtdAmountQuery({ variables, fetchPolicy: 'cache-and-network' });

  // ===== Handlers ===== //
  const handleSelectChange = (range: DateRange) => ftdAmountQuery.refetch({ ...variables, ...range });

  return (
    <ChartWidget
      title={I18n.t('DASHBOARD.FTD_AMOUNT_CHART.TITLE')}
      tooltipTitle={I18n.t('DASHBOARD.FTD_AMOUNT_CHART.TOOLTIP_TITLE')}
      data={ftdAmountQuery.data?.dashboard?.ftdAmountStatistic?.items || []}
      summary={ftdAmountQuery.data?.dashboard?.ftdAmountStatistic?.summary || []}
      loading={ftdAmountQuery.loading}
      noData={!!ftdAmountQuery.error}
      onSelectChange={handleSelectChange}
      chartColor="var(--state-colors-success)"
      chartType={chartType}
      currncySymbol={getBrand().currencies?.base}
    />
  );
};

export default React.memo(FtdAmountChart);
