import React from 'react';
import I18n from 'i18n-js';
import { LastWithdrawalDepositFragment } from 'fragments/__generated__/lastWithdrawalDeposit';
import { Grids } from 'routes/Dashboard/types';
import useGrid from 'routes/Dashboard/hooks/useGrid';
import { useLastWithdrawalsQuery } from 'routes/Dashboard/graphql/__generated__/LastWithdrawalsQuery';
import DashboardPaymentsGrid from '../DashboardPaymentsGrid';
import './LastWithdrawalsGrid.scss';

const LastWithdrawalsGrid = () => {
  const {
    content,
    loading,
    refetch,
  } = useGrid<Array<LastWithdrawalDepositFragment>>(useLastWithdrawalsQuery, Grids.lastWithdrawals);

  return (
    <div className="LastWithdrawalsGrid">
      <div className="LastWithdrawalsGrid__title">
        {I18n.t('DASHBOARD.LATEST_WITHDRAWALS')}
      </div>

      <DashboardPaymentsGrid
        data={content}
        loading={loading}
        refetch={refetch}
      />
    </div>
  );
};

export default React.memo(LastWithdrawalsGrid);
