import React, { Fragment } from 'react';
import I18n from 'i18n-js';
import RegistrationsChart from './components/Charts/RegistrationsChart';
import DepositAmountChart from './components/Charts/DepositAmountChart';
import DepositCountChart from './components/Charts/DepositCountChart';
import WithdrawsAmountChart from './components/Charts/WithdrawsAmountChart';
import WithdrawsCountChart from './components/Charts/WithdrawsCountChart';
import PaymentsGrid from './components/Grids/PaymentsGrid';
import ClientsGrid from './components/Grids/ClientsGrid';
import { tradingTypes, statuses, statusMapper } from '../../constants/payment';
import './dashboard.scss';

const defaultChartProps = {
  page: {
    from: 0,
    size: 10,
  },
  statuses: statusMapper[statuses.COMPLETED],
};

const options = {
  DEPOSITS: {
    paymentTypes: [tradingTypes.DEPOSIT],
    ...defaultChartProps,
  },
  WITHDRAWALS: {
    paymentTypes: [tradingTypes.WITHDRAW],
    ...defaultChartProps,
  },
  REGISTRATIONS: {
    size: 10,
  },
};

const Dashboard = () => (
  <Fragment>
    <div className="dashboard__topic">{I18n.t('COMMON.DASHBOARD')}</div>

    <div className="dashboard__charts">
      <RegistrationsChart />
      <DepositAmountChart />
      <DepositCountChart />
      <WithdrawsAmountChart />
      <WithdrawsCountChart />
    </div>

    {/* Latest deposits */}
    <div className="dashboard__topic">
      {I18n.t('DASHBOARD.LATEST_DEPOSITS', { count: options.DEPOSITS.limit })}
    </div>
    <PaymentsGrid {...options.DEPOSITS} />

    {/* Latest withdrawals */}
    <div className="dashboard__topic">
      {I18n.t('DASHBOARD.LATEST_WITHDRAWALS', { count: options.WITHDRAWALS.limit })}
    </div>
    <PaymentsGrid {...options.WITHDRAWALS} />

    {/* Latest registrations */}
    <div className="dashboard__topic">
      {I18n.t('DASHBOARD.LATEST_REGISTRATIONS', { count: options.REGISTRATIONS.size })}
    </div>
    <ClientsGrid {...options.REGISTRATIONS} />
  </Fragment>
);

export default Dashboard;
