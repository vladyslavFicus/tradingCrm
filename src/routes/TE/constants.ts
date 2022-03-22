import Permissions from 'utils/permissions';
import permissions from 'config/permissions';

const tradingEngineTabs = [
  {
    url: '/trading-engine/accounts',
    label: 'TRADING_ENGINE.TABS.ACCOUNTS',
    permissions: new Permissions(permissions.WE_TRADING.ACCOUNTS_LIST),
  },
  {
    url: '/trading-engine/orders',
    label: 'TRADING_ENGINE.TABS.ORDERS',
    permissions: new Permissions(permissions.WE_TRADING.ORDERS_LIST),
  },
  {
    url: '/trading-engine/quotes',
    label: 'TRADING_ENGINE.TABS.QUOTES',
    permissions: new Permissions(permissions.WE_TRADING.SYMBOLS_LIST),
  },
  {
    url: '/trading-engine/symbols',
    label: 'TRADING_ENGINE.TABS.SYMBOLS',
    permissions: new Permissions(permissions.WE_TRADING.SYMBOLS_LIST),
  },
  {
    url: '/trading-engine/groups',
    label: 'TRADING_ENGINE.TABS.GROUPS',
    permissions: new Permissions(permissions.WE_TRADING.GROUPS_LIST),
  },
  {
    url: '/trading-engine/securities',
    label: 'TRADING_ENGINE.TABS.SECURITIES',
    permissions: new Permissions(permissions.WE_TRADING.SECURITIES_LIST),
  },
  {
    url: '/trading-engine/holidays',
    label: 'TRADING_ENGINE.TABS.HOLIDAYS',
    permissions: new Permissions(permissions.WE_TRADING.HOLIDAYS_LIST),
  },
  {
    url: '/trading-engine/operators',
    label: 'TRADING_ENGINE.TABS.OPERATORS',
    permissions: new Permissions(permissions.WE_TRADING.OPERATORS_LIST),
  },
];

const securityNamePattern = '/^[A-Za-z0-9.*@+-_!=]*$/';


const orderTypes = {
  BUY: 'TRADING_ENGINE.ORDERS.FILTER_FORM.TYPES.BUY',
  BUY_LIMIT: 'TRADING_ENGINE.ORDERS.FILTER_FORM.TYPES.BUY_LIMIT',
  BUY_STOP_LIMIT: 'TRADING_ENGINE.ORDERS.FILTER_FORM.TYPES.BUY_STOP_LIMIT',
  BUY_MARKET: 'TRADING_ENGINE.ORDERS.FILTER_FORM.TYPES.BUY_MARKET',
  BUY_STOP: 'TRADING_ENGINE.ORDERS.FILTER_FORM.TYPES.BUY_STOP',
  CREDIT: 'TRADING_ENGINE.ORDERS.FILTER_FORM.TYPES.CREDIT',
  SELL: 'TRADING_ENGINE.ORDERS.FILTER_FORM.TYPES.SELL',
  SELL_LIMIT: 'TRADING_ENGINE.ORDERS.FILTER_FORM.TYPES.SELL_LIMIT',
  SELL_STOP_LIMIT: 'TRADING_ENGINE.ORDERS.FILTER_FORM.TYPES.SELL_STOP_LIMIT',
  SELL_MARKET: 'TRADING_ENGINE.ORDERS.FILTER_FORM.TYPES.SELL_MARKET',
  SELL_STOP: 'TRADING_ENGINE.ORDERS.FILTER_FORM.TYPES.SELL_STOP',
};

const orderStatuses = {
  OPEN: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.STATUSES.OPEN',
  CLOSED: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.STATUSES.CLOSED',
  PENDING: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.STATUSES.PENDING',
  CANCELED: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.STATUSES.CANCELED',
};

const passwordPattern = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$';
const passwordMaxSize = 16;

export {
  tradingEngineTabs,
  securityNamePattern,
  orderTypes,
  orderStatuses,
  passwordPattern,
  passwordMaxSize,
};
