const accountTypes = {
  LIVE: 'TRADING_ENGINE.ACCOUNTS.FORM.ACCOUNT_TYPE.LIVE',
  DEMO: 'TRADING_ENGINE.ACCOUNTS.FORM.ACCOUNT_TYPE.DEMO',
};

const statuses = [{
  value: true,
  label: 'TRADING_ENGINE.ACCOUNTS.FORM.STATUS.NOT_ARCHIVED',
}, {
  value: false,
  label: 'TRADING_ENGINE.ACCOUNTS.FORM.STATUS.ARCHIVED',
}];

export {
  statuses,
  accountTypes,
};
