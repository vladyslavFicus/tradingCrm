const accountTypes = {
  LIVE: 'TRADING_ACCOUNTS.FORM.ACCOUNT_TYPE.LIVE',
  DEMO: 'TRADING_ACCOUNTS.FORM.ACCOUNT_TYPE.DEMO',
};

const accountStatuses = [{
  value: false,
  label: 'TRADING_ACCOUNTS.FORM.STATUS.NOT_ARCHIVED',
}, {
  value: true,
  label: 'TRADING_ACCOUNTS.FORM.STATUS.ARCHIVED',
}];

export {
  accountTypes,
  accountStatuses,
};
