export enum AccountTypes {
  LIVE = 'LIVE',
  DEMO = 'DEMO',
}

export const AccountTypeLabels = {
  [AccountTypes.LIVE]: 'TRADING_ACCOUNTS.FORM.ACCOUNT_TYPE.LIVE',
  [AccountTypes.DEMO]: 'TRADING_ACCOUNTS.FORM.ACCOUNT_TYPE.DEMO',
};

export const AccountStatuses = [{
  value: false,
  label: 'TRADING_ACCOUNTS.FORM.STATUS.NOT_ARCHIVED',
}, {
  value: true,
  label: 'TRADING_ACCOUNTS.FORM.STATUS.ARCHIVED',
}];
