import React, { Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import { RegistrationChart, DepositsAmount, DepositsCount, WithdrawsAmount, WithdrawsCount } from './Charts';
import PaymentsGrid from './Grids/PaymentsGrid';
import ClientsGrid from './Grids/ClientsGrid';
import './Dashboard.scss';

const options = {
  DEPOSITS: {
    size: 10,
    type: 'Deposit',
    statuses: 'COMPLETED,PENDING',
  },
  WITHDRAWALS: {
    size: 10,
    type: 'Withdraw',
    statuses: 'COMPLETED,PENDING',
  },
  REGISTRATIONS: {
    size: 10,
  },
};

const Dashboard = () => (
  <Fragment>
    <div className="font-size-20 margin-bottom-15">{I18n.t('COMMON.DASHBOARD')}</div>
    <div className="row chart-row">
      <div className="col-md-4">
        <RegistrationChart />
      </div>
      <div className="col-md-4">
        <DepositsAmount />
      </div>
      <div className="col-md-4">
        <DepositsCount />
      </div>
      <div className="col-md-4">
        <WithdrawsAmount />
      </div>
      <div className="col-md-4">
        <WithdrawsCount />
      </div>
    </div>

    {/* Latest deposits */}
    <div className="font-size-20 margin-bottom-15">
      {I18n.t('DASHBOARD.LATEST_DEPOSITS', { count: options.DEPOSITS.size })}
    </div>
    <PaymentsGrid {...options.DEPOSITS} />

    {/* Latest withdrawals */}
    <div className="font-size-20 margin-bottom-15">
      {I18n.t('DASHBOARD.LATEST_WITHDRAWALS', { count: options.WITHDRAWALS.size })}
    </div>
    <PaymentsGrid type="Withdraw" {...options.WITHDRAWALS} />

    {/* Latest registrations */}
    <div className="font-size-20 margin-bottom-15">
      {I18n.t('DASHBOARD.LATEST_REGISTRATIONS', { count: options.REGISTRATIONS.size })}
    </div>
    <ClientsGrid {...options.REGISTRATIONS} />
  </Fragment>
);

export default Dashboard;
