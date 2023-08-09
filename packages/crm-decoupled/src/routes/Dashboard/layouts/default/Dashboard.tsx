import React, { Fragment, useCallback } from 'react';
import I18n from 'i18n-js';
import { Navigate } from 'react-router-dom';
import { Config } from '@crm/common';
import { WidgetNames, ChartTypes, Widget } from 'types/config';
import UseDashboard from 'routes/Dashboard/hooks/useDashboard';
import LastDepositsGrid from './components/Grids/LastDepositsGrid';
import LastNotificationsGrid from './components/Grids/LastNotificationsGrid';
import LastRegistrationsGrid from './components/Grids/LastRegistrationsGrid';
import LastWithdrawalsGrid from './components/Grids/LastWithdrawalsGrid';
import RegistrationsChart from './components/Charts/RegistrationsChart';
import DepositAmountChart from './components/Charts/DepositAmountChart';
import DepositCountChart from './components/Charts/DepositCountChart';
import WithdrawalAmountChart from './components/Charts/WithdrawalAmountChart';
import WithdrawalCountChart from './components/Charts/WithdrawalCountChart';
import RetentionAmountChart from './components/Charts/RetentionAmountChart';
import RetentionCountChart from './components/Charts/RetentionCountChart';
import FtrAmountChart from './components/Charts/FtrAmountChart';
import FtrCountChart from './components/Charts/FtrCountChart';
import FtdAmountChart from './components/Charts/FtdAmountChart';
import FtdCountChart from './components/Charts/FtdCountChart';
import ScreenerWidget from './components/TradingViewWidget/ScreenerWidget/ScreenerWidget';
import './Dashboard.scss';

type WidgetComponent = React.FC<{
  chartType?: ChartTypes,
}>

type WidgetConfig = {
  component: WidgetComponent,
  permission: string,
}

const WIDGETS_CONFIG: Record<WidgetNames, WidgetConfig> = {
  // Charts
  [WidgetNames.REGISTRATIONS]: {
    component: RegistrationsChart,
    permission: Config.permissions.DASHBOARD.REGISTRATIONS,
  },
  [WidgetNames.DEPOSITS_AMOUNT]: {
    component: DepositAmountChart,
    permission: Config.permissions.DASHBOARD.DEPOSITS_AMOUNT,
  },
  [WidgetNames.DEPOSITS_COUNT]: {
    component: DepositCountChart,
    permission: Config.permissions.DASHBOARD.DEPOSITS_COUNT,
  },
  [WidgetNames.WITHDRAWAL_AMOUNT]: {
    component: WithdrawalAmountChart,
    permission: Config.permissions.DASHBOARD.WITHDRAWAL_AMOUNT,
  },
  [WidgetNames.WITHDRAWAL_COUNT]: {
    component: WithdrawalCountChart,
    permission: Config.permissions.DASHBOARD.WITHDRAWAL_COUNT,
  },
  [WidgetNames.RETENTION_AMOUNT]: {
    component: RetentionAmountChart,
    permission: Config.permissions.DASHBOARD.RETENTION_AMOUNT,
  },
  [WidgetNames.RETENTION_COUNT]: {
    component: RetentionCountChart,
    permission: Config.permissions.DASHBOARD.RETENTION_COUNT,
  },
  [WidgetNames.FTR_AMOUNT]: {
    component: FtrAmountChart,
    permission: Config.permissions.DASHBOARD.FTR_AMOUNT,
  },
  [WidgetNames.FTR_COUNT]: {
    component: FtrCountChart,
    permission: Config.permissions.DASHBOARD.FTR_COUNT,
  },
  [WidgetNames.FTD_AMOUNT]: {
    component: FtdAmountChart,
    permission: Config.permissions.DASHBOARD.FTD_AMOUNT,
  },
  [WidgetNames.FTD_COUNT]: {
    component: FtdCountChart,
    permission: Config.permissions.DASHBOARD.FTD_COUNT,
  },
  // Grids
  [WidgetNames.LATEST_DEPOSITS]: {
    component: LastDepositsGrid,
    permission: Config.permissions.DASHBOARD.LATEST_DEPOSITS,
  },
  [WidgetNames.LATEST_WITHDRAWALS]: {
    component: LastWithdrawalsGrid,
    permission: Config.permissions.DASHBOARD.LATEST_WITHDRAWALS,
  },
  [WidgetNames.LATEST_REGISTRATIONS]: {
    component: LastRegistrationsGrid,
    permission: Config.permissions.DASHBOARD.LATEST_REGISTRATIONS,
  },
  [WidgetNames.LATEST_NOTIFICATIONS]: {
    component: LastNotificationsGrid,
    permission: Config.permissions.DASHBOARD.LATEST_NOTIFICATIONS,
  },
  // Trading view
  [WidgetNames.SCREENER_WIDGET]: {
    component: ScreenerWidget,
    permission: Config.permissions.DASHBOARD.SCREENER_WIDGET,
  },
};

const Dashboard = () => {
  const {
    id,
    permission,
    widgets,
  } = UseDashboard();

  //  Redirect to TE Manager or to TE Admin only for brand "trading-engine"
  if (id === 'trading-engine') {
    return <Navigate replace to="/trading-engine" />;
  }

  const renderWidget = useCallback((widget: Widget) => {
    const { name, newRowAfter, chartType = ChartTypes.LINE } = widget;
    const widgetName = WIDGETS_CONFIG[name];

    if (!widgetName) return null;

    const isAvailable = permission.allows(widgetName.permission);

    if (isAvailable) {
      const Component = widgetName.component;
      return (
        <Fragment key={name}>
          <Component chartType={chartType} />

          <If condition={!!newRowAfter}>
            <br />
          </If>
        </Fragment>
      );
    }

    return null;
  }, [permission]);

  return (
    <>
      <div className="Dashboard__topic">
        {I18n.t('COMMON.DASHBOARD')}
      </div>

      <div className="Dashboard__widgets">
        {widgets.map(renderWidget)}
      </div>
    </>
  );
};

export default React.memo(Dashboard);
