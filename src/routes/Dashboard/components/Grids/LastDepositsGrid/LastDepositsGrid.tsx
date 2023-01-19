import React from 'react';
import I18n from 'i18n-js';
import DashboardPaymentsGrid from '../DashboardPaymentsGrid';
import { useLastDepositsQuery } from './graphql/__generated__/LastDepositsQuery';
import './LastDepositsGrid.scss';

const LastDepositsGrid = () => {
  const { data, loading, refetch } = useLastDepositsQuery();

  return (
    <div className="LastDepositsGrid">
      <div className="LastDepositsGrid__title">
        {I18n.t('DASHBOARD.LATEST_DEPOSITS')}
      </div>

      <DashboardPaymentsGrid
        data={data?.dashboard?.lastDeposits || []}
        loading={loading}
        refetch={refetch}
      />
    </div>
  );
};

export default React.memo(LastDepositsGrid);
