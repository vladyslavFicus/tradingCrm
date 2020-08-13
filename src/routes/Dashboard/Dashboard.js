import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import { tradingTypes } from 'constants/payment';
import permissions from 'config/permissions';
import PermissionContent from 'components/PermissionContent';
import RegistrationsChart from './components/Charts/RegistrationsChart';
import DepositAmountChart from './components/Charts/DepositAmountChart';
import DepositCountChart from './components/Charts/DepositCountChart';
import WithdrawsAmountChart from './components/Charts/WithdrawsAmountChart';
import WithdrawsCountChart from './components/Charts/WithdrawsCountChart';
import PaymentsGrid from './components/Grids/PaymentsGrid';
import ClientsGrid from './components/Grids/ClientsGrid';
import './Dashboard.scss';

const GRID_SIZE = 10;

class Dashboard extends PureComponent {
  render() {
    return (
      <Fragment>
        <div className="Dashboard__topic">{I18n.t('COMMON.DASHBOARD')}</div>

        <div className="Dashboard__charts">
          <PermissionContent permissions={permissions.DASHBOARD.REGISTRATION_STATISTICS}>
            <RegistrationsChart />
          </PermissionContent>
          <PermissionContent permissions={permissions.DASHBOARD.PAYMENT_STATISTICS}>
            <DepositAmountChart />
            <DepositCountChart />
            <WithdrawsAmountChart />
            <WithdrawsCountChart />
          </PermissionContent>
        </div>

        <PermissionContent permissions={permissions.DASHBOARD.PAYMENTS_LIST}>
          <div className="Dashboard__topic">
            {I18n.t('DASHBOARD.LATEST_DEPOSITS', { count: GRID_SIZE })}
          </div>
          <PaymentsGrid
            size={GRID_SIZE}
            paymentTypes={[tradingTypes.DEPOSIT]}
          />

          <div className="Dashboard__topic">
            {I18n.t('DASHBOARD.LATEST_WITHDRAWALS', { count: GRID_SIZE })}
          </div>
          <PaymentsGrid
            size={GRID_SIZE}
            paymentTypes={[tradingTypes.WITHDRAW]}
          />
        </PermissionContent>

        <PermissionContent permissions={permissions.DASHBOARD.PROFILES_LIST}>
          <div className="Dashboard__topic">
            {I18n.t('DASHBOARD.LATEST_REGISTRATIONS', { count: GRID_SIZE })}
          </div>
          <ClientsGrid size={GRID_SIZE} />
        </PermissionContent>
      </Fragment>
    );
  }
}

export default Dashboard;
