import React, { Fragment } from 'react';
import I18n from 'i18n-js';
import { Redirect } from 'react-router-dom';
import compose from 'compose-function';
import { getBackofficeBrand } from 'config';
import { WidgetNames, ChartTypes, Widget } from 'types/config';
import { withStorage } from 'providers/StorageProvider';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import LastDepositsGrid from 'routes/Dashboard/components/Grids/LastDepositsGrid';
import LastNotificationsGrid from 'routes/Dashboard/components/Grids/LastNotificationsGrid';
import LastRegistrationsGrid from 'routes/Dashboard/components/Grids/LastRegistrationsGrid';
import LastWithdrawalsGrid from 'routes/Dashboard/components/Grids/LastWithdrawalsGrid';
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
    permission: permissions.DASHBOARD.REGISTRATIONS,
  },
  [WidgetNames.DEPOSITS_AMOUNT]: {
    component: DepositAmountChart,
    permission: permissions.DASHBOARD.DEPOSITS_AMOUNT,
  },
  [WidgetNames.DEPOSITS_COUNT]: {
    component: DepositCountChart,
    permission: permissions.DASHBOARD.DEPOSITS_COUNT,
  },
  [WidgetNames.WITHDRAWAL_AMOUNT]: {
    component: WithdrawalAmountChart,
    permission: permissions.DASHBOARD.WITHDRAWAL_AMOUNT,
  },
  [WidgetNames.WITHDRAWAL_COUNT]: {
    component: WithdrawalCountChart,
    permission: permissions.DASHBOARD.WITHDRAWAL_COUNT,
  },
  [WidgetNames.RETENTION_AMOUNT]: {
    component: RetentionAmountChart,
    permission: permissions.DASHBOARD.RETENTION_AMOUNT,
  },
  [WidgetNames.RETENTION_COUNT]: {
    component: RetentionCountChart,
    permission: permissions.DASHBOARD.RETENTION_COUNT,
  },
  [WidgetNames.FTR_AMOUNT]: {
    component: FtrAmountChart,
    permission: permissions.DASHBOARD.FTR_AMOUNT,
  },
  [WidgetNames.FTR_COUNT]: {
    component: FtrCountChart,
    permission: permissions.DASHBOARD.FTR_COUNT,
  },
  [WidgetNames.FTD_AMOUNT]: {
    component: FtdAmountChart,
    permission: permissions.DASHBOARD.FTD_AMOUNT,
  },
  [WidgetNames.FTD_COUNT]: {
    component: FtdCountChart,
    permission: permissions.DASHBOARD.FTD_COUNT,
  },
  // Grids
  [WidgetNames.LATEST_DEPOSITS]: {
    component: LastDepositsGrid,
    permission: permissions.DASHBOARD.LATEST_DEPOSITS,
  },
  [WidgetNames.LATEST_WITHDRAWALS]: {
    component: LastWithdrawalsGrid,
    permission: permissions.DASHBOARD.LATEST_WITHDRAWALS,
  },
  [WidgetNames.LATEST_REGISTRATIONS]: {
    component: LastRegistrationsGrid,
    permission: permissions.DASHBOARD.LATEST_REGISTRATIONS,
  },
  [WidgetNames.LATEST_NOTIFICATIONS]: {
    component: LastNotificationsGrid,
    permission: permissions.DASHBOARD.LATEST_NOTIFICATIONS,
  },
  // Trading view
  [WidgetNames.SCREENER_WIDGET]: {
    component: ScreenerWidget,
    permission: permissions.DASHBOARD.SCREENER_WIDGET,
  },
};

type Props = {
  brand: {
    id: String,
  },
};

const Dashboard = (props: Props) => {
  const permission = usePermission();
  const widgets = getBackofficeBrand()?.dashboard?.widgets || [];

  //  Redirect to TE Manager or to TE Admin only for brand "trading-engine"
  if (props.brand.id === 'trading-engine') {
    return <Redirect to="/trading-engine" />;
  }

  const renderWidget = (widget: Widget) => {
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
  };

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

export default compose(
  React.memo,
  withStorage(['brand']),
)(Dashboard);
