// TODO: Change names after implementing real components
export enum WidgetNames {
  REGISTRATIONS = 'Registrations',
  DEPOSITS_AMOUNT = 'DepositsAmount',
  DEPOSITS_COUNT = 'DepositsCount',
  WITHDRAWAL_AMOUNT = 'WithdrawalAmount',
  WITHDRAWAL_COUNT = 'WithdrawalCount',
  RETENTION_AMOUNT = 'RetentionAmount',
  RETENTION_COUNT = 'RetentionCount',
  FTR_AMOUNT = 'FtrAmount',
  FTR_COUNT = 'FtrCount',
  FTD_AMOUNT = 'FtdAmount',
  FTD_COUNT = 'FtdCount',
  LATEST_DEPOSITS = 'LatestDeposits',
  LATEST_WITHDRAWALS = 'LatestWithdrawals',
  LATEST_REGISTRATIONS = 'LatestRegistrations',
  LATEST_NOTIFICATIONS = 'LatestNotifications',
  SCREENER_WIDGET = 'ScreenerWidget',
}

export enum ChartTypes {
  LINE = 'LINE',
  AREA = 'AREA',
  BARV = 'BARV',
  BARH = 'BARH',
}

export type Widget = {
  name: WidgetNames,
  chartType?: ChartTypes,
  newRowAfter?: boolean,
};

type Dashboard = {
  widgets: Array<Widget>,
};

type ColumnsOrder = {
  columnsOrder: Array<string>,
};

type Tables = Record<string, ColumnsOrder>;

export type BackOfficeBrand = {
  id: string,
  sidebarPosition?: 'left' | 'right',
  dashboard?: Dashboard,
  locales: Array<string>,
  tables?: Tables,
};
