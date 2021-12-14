const tradingEngineAdminTabs = [
  {
    url: '/trading-engine-admin/symbols',
    label: 'TRADING_ENGINE.TABS.SYMBOLS',
  },
  {
    url: '/trading-engine-admin/orders',
    label: 'TRADING_ENGINE.TABS.ORDERS',
  },
  {
    url: '/trading-engine-admin/securities',
    label: 'TRADING_ENGINE.TABS.SECURITIES',
  },
];

const securityNamePattern = '/^[A-Za-z0-9.*@+-_!=]*$/';

export {
  tradingEngineAdminTabs,
  securityNamePattern,
};
