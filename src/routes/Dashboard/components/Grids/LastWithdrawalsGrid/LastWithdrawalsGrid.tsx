import React from 'react';
import I18n from 'i18n-js';
import DashboardPaymentsGrid from '../DashboardPaymentsGrid';
import { useLastWithdrawalsQuery } from './graphql/__generated__/LastWithdrawalsQuery';
import './LastWithdrawalsGrid.scss';

const LastWithdrawalsGrid = () => {
  const { data, loading, refetch } = useLastWithdrawalsQuery();

  return (
    <div className="LastWithdrawalsGrid">
      <div className="LastWithdrawalsGrid__title">
        {I18n.t('DASHBOARD.LATEST_WITHDRAWALS')}
      </div>

      <DashboardPaymentsGrid
        data={data?.dashboard?.lastWithdrawals || []}
        loading={loading}
        refetch={refetch}
      />
    </div>
  );
};

export default React.memo(LastWithdrawalsGrid);
