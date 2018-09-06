import React, { Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import { RegistrationChart, DepositsAmount, DepositsCount, WithdrawsAmount, WithdrawsCount } from './Charts';
import './Dashboard.scss';

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
  </Fragment>
);

export default Dashboard;
