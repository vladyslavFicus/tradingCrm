import React from 'react';
import I18n from 'i18n-js';
import { ChartTypes } from 'types/config';
import ChartWidget from '../ChartWidget';
import { DateRange } from '../ChartWidget/types';
import { chartInitialQueryParams } from '../ChartWidget/utils';
import { useRegistrationsQuery } from './graphql/__generated__/RegistrationsQuery';

type Props = {
  chartType?: ChartTypes,
};

const RegistrationsChart = (props: Props) => {
  const { chartType } = props;

  // Initial variables
  const variables = chartInitialQueryParams();

  // ===== Requests ===== //
  const registrationsQuery = useRegistrationsQuery({ variables, fetchPolicy: 'cache-and-network' });

  // ===== Handlers ===== //
  const handleSelectChange = (range: DateRange) => registrationsQuery.refetch({ ...variables, ...range });

  return (
    <ChartWidget
      title={I18n.t('DASHBOARD.REGISTRATION_CHART.TITLE')}
      tooltipTitle={I18n.t('DASHBOARD.REGISTRATION_CHART.TOOLTIP_TITLE')}
      data={registrationsQuery.data?.dashboard?.registrationStatistic?.items || []}
      summary={registrationsQuery.data?.dashboard?.registrationStatistic?.summary || []}
      loading={registrationsQuery.loading}
      noData={!!registrationsQuery.error}
      onSelectChange={handleSelectChange}
      chartColor="var(--state-colors-warning)"
      chartType={chartType}
    />
  );
};

export default React.memo(RegistrationsChart);
