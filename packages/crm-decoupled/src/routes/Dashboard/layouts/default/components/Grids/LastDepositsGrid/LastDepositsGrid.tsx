import React from 'react';
import I18n from 'i18n-js';
import { Grids } from 'routes/Dashboard/types';
import useGrid from 'routes/Dashboard/hooks/useGrid';
import { LastWithdrawalDepositFragment } from 'apollo/fragments/__generated__/lastWithdrawalDeposit';
import {
  useLastDepositsQuery,
} from 'routes/Dashboard/graphql/__generated__/LastDepositsQuery';
import DashboardPaymentsGrid from '../DashboardPaymentsGrid';
import './LastDepositsGrid.scss';

const LastDepositsGrid = () => {
  const {
    loading,
    refetch,
    content,
  } = useGrid<Array<LastWithdrawalDepositFragment>>(
    useLastDepositsQuery,
    Grids.lastDeposits,
  );

  return (
    <div className="LastDepositsGrid">
      <div className="LastDepositsGrid__title">
        {I18n.t('DASHBOARD.LATEST_DEPOSITS')}
      </div>

      <DashboardPaymentsGrid
        data={content}
        loading={loading}
        refetch={refetch}
      />
    </div>
  );
};

export default React.memo(LastDepositsGrid);
