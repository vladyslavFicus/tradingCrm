const accountTypes = {
  LIVE: 'TRADING_ACCOUNTS.FORM.ACCOUNT_TYPE.LIVE',
  DEMO: 'TRADING_ACCOUNTS.FORM.ACCOUNT_TYPE.DEMO',
};

const accountStatuses = {
  0: 'TRADING_ACCOUNTS.FORM.STATUS.NOT_ARCHIVED',
  1: 'TRADING_ACCOUNTS.FORM.STATUS.ARCHIVED',
};

const affiliateTypes = [
  {
    label: 'TRADING_ACCOUNTS.FORM.AFFILIATE_TYPE.AFFILIATE',
    value: 'AFFILIATE',
  },
  {
    label: 'TRADING_ACCOUNTS.FORM.AFFILIATE_TYPE.NONE',
    value: 'NONE',
  },
];

export {
  accountTypes,
  accountStatuses,
  affiliateTypes,
};
