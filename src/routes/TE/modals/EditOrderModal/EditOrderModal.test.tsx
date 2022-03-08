import React from 'react';
import moment from 'moment';
import {
  render as testingLibraryRender,
  screen,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved, act,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import permissions from 'config/permissions';
import { MockedPermissionProvider } from 'providers/PermissionsProvider';
import StorageProvider from 'providers/StorageProvider';
import CoreLayout from 'layouts/CoreLayout';
import { MockedRSocketProvider } from 'rsocket';
import capitalize from 'utils/capitalize';
import { OrderQueryDocument } from './graphql/__generated__/OrderQuery';
import EditOrderModal from './EditOrderModal';

// Mocks
jest.mock('components/SymbolChart', () => () => null);

// Define props for EditOrderModal
const props = {
  isOpen: true,
  onCloseModal: () => null,
  onSuccess: () => null,
  notify: () => null,
  id: 144369,
};

const apolloMockResponseData = {
  account: {
    currency: 'EUR',
  },
  accountLogin: 144354,
  accountUuid: 'WET-4fdfd959-e853-4cca-bfc8-6469fa6acd16',
  closePrice: null,
  comment: '',
  commission: 0,
  digits: 5,
  direction: 'BUY',
  symbolConfig: {
    lotSize: 100000,
    lotStep: 0.01,
    lotMax: 100,
    bidAdjustment: 0,
    askAdjustment: 0,
  },
  id: 143749,
  marginRate: null,
  openPrice: 1.1345,
  status: 'OPEN',
  stopLoss: null,
  swaps: 0,
  symbol: 'EURUSD',
  symbolAlias: 'EURUSD',
  takeProfit: null,
  openRate: 1,
  closeRate: 0,
  margin: 100,
  pnl: {
    gross: 0,
    net: 0,
  },
  reason: 'OPERATOR',
  time: {
    closing: null,
    creation: '2021-11-18T15:13:19.29864',
    expiration: null,
    modification: null,
  },
  tradeType: 'MARKET',
  type: 'BUY',
  volumeLots: 0.08,
  volumeUnits: 1000,
};

// Define mocks for Apollo
const apolloMockFactory = (data = {}) => [{
  request: {
    query: OrderQueryDocument,
    variables: { orderId: props.id },
  },
  result: {
    data: {
      tradingEngine: {
        order: {
          ...apolloMockResponseData,
          ...data,
        },
      },
    },
  },
}];

const rsocketMockFactory = (data = {}) => ({
  request: {
    route: 'streamAllSymbolPrices',
    data: { symbols: ['EURUSD'] },
  },
  onNext: {
    data: {
      symbol: 'EURUSD',
      ask: 1.1552,
      bid: 1.1548,
      dateTime: '2021-11-04T17:41:11.829',
      pnlRates: {
        GBP: 0.7412239089184061,
        USD: 1,
        EUR: 0.8659658116697554,
      },
      marginRates: {
        GBP: 0.85603,
        USD: 1.15478,
        EUR: 1,
      },
      ...data,
    },
  },
});

// Custom renderer
const render = (
  component: React.ReactElement,
  apolloMockData = {},
  _permissions: string[] = [],
) => testingLibraryRender(
  <BrowserRouter>
    <StorageProvider>
      <MockedProvider mocks={apolloMockFactory(apolloMockData)} addTypename={false}>
        <MockedRSocketProvider>
          <MockedPermissionProvider permissions={_permissions}>
            <CoreLayout>
              {component}
            </CoreLayout>
          </MockedPermissionProvider>
        </MockedRSocketProvider>
      </MockedProvider>
    </StorageProvider>
  </BrowserRouter>,
);

it('Render EditOrderModal without any permissions', async () => {
  const {
    id,
    type,
    volumeLots,
    symbol,
    commission,
    openPrice,
    swaps,
    stopLoss,
    takeProfit,
    comment,
    margin,
    time,
  } = apolloMockResponseData;

  // Arrange
  const floatingPnL = '140.63';
  const netPnL = '140.63';

  const ask = 1.15520;
  const bid = 1.15480;

  // Act
  render(<EditOrderModal {...props} />);

  // Wait for order loading
  await waitForElementToBeRemoved(() => screen.getByText(/Loading.../));

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  await act(async () => {
    // We should wait 500 ms (update interval in useSymbolsStream) to notify component about changes
    await new Promise(res => setTimeout(res, 500));
  });

  expect(screen.getByLabelText('Order')).toBeDisabled();
  expect(screen.getByLabelText('Order')).toHaveValue(`Deal #${id}, ${capitalize(type)} ${volumeLots} ${symbol}`);
  expect(screen.getByLabelText('Open price')).toBeDisabled();
  expect(screen.getByLabelText('Open price')).toHaveValue(openPrice);
  expect(screen.getByLabelText('Open time')).toBeDisabled();
  expect(screen.getByLabelText('Open time')).toHaveValue(
    moment.utc(time.creation).local(false).format('DD.MM.YYYY HH:mm:ss'),
  );
  expect(screen.queryByLabelText('Expiry')).toBeNull();
  expect(screen.getByLabelText('Stop Loss')).toBeDisabled();
  expect(screen.getByLabelText('Stop Loss')).toHaveValue(stopLoss);
  expect(screen.getByLabelText('Take profit')).toBeDisabled();
  expect(screen.getByLabelText('Take profit')).toHaveValue(takeProfit);
  expect(screen.getByLabelText('Commission')).toBeDisabled();
  expect(screen.getByLabelText('Commission')).toHaveValue(commission);
  expect(screen.getByLabelText('Swaps')).toBeDisabled();
  expect(screen.getByLabelText('Swaps')).toHaveValue(swaps);
  expect(screen.getByLabelText('Floating P/L')).toBeDisabled();
  expect(screen.getByLabelText('Floating P/L')).toHaveValue(floatingPnL);
  expect(screen.getByLabelText('Net Floating P/L')).toBeDisabled();
  expect(screen.getByLabelText('Net Floating P/L')).toHaveValue(netPnL);
  expect(screen.getByLabelText('Margin')).toBeDisabled();
  expect(screen.getByLabelText('Margin')).toHaveValue(margin);
  expect(screen.getByLabelText('Comment')).toBeDisabled();
  expect(screen.getByLabelText('Comment')).toHaveValue(comment);
  expect(screen.queryByTestId('updateOrder')).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Cancel order' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Reopen' })).not.toBeInTheDocument();
});

it('Render EditOrderModal with manager edit order permission', async () => {
  const {
    id,
    type,
    volumeLots,
    symbol,
    commission,
    openPrice,
    swaps,
    stopLoss,
    takeProfit,
    comment,
    margin,
    time,
  } = apolloMockResponseData;

  // Arrange
  const floatingPnL = '140.63';
  const netPnL = '140.63';

  const ask = 1.15520;
  const bid = 1.15480;

  const _permissions = [
    permissions.WE_TRADING.MANAGER_EDIT_ORDER,
  ];

  // Act
  render(<EditOrderModal {...props} />, {}, _permissions);

  // Wait for order loading
  await waitForElementToBeRemoved(() => screen.getByText(/Loading.../));

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  await act(async () => {
    // We should wait 500 ms (update interval in useSymbolsStream) to notify component about changes
    await new Promise(res => setTimeout(res, 500));
  });

  expect(screen.getByLabelText('Order')).toBeDisabled();
  expect(screen.getByLabelText('Order')).toHaveValue(`Deal #${id}, ${capitalize(type)} ${volumeLots} ${symbol}`);
  expect(screen.getByLabelText('Open price')).toBeEnabled();
  expect(screen.getByLabelText('Open price')).toHaveValue(openPrice);
  expect(screen.getByLabelText('Open time')).toBeDisabled();
  expect(screen.getByLabelText('Open time')).toHaveValue(
    moment.utc(time.creation).local(false).format('DD.MM.YYYY HH:mm:ss'),
  );
  expect(screen.queryByLabelText('Expiry')).toBeNull();
  expect(screen.getByLabelText('Stop Loss')).toBeEnabled();
  expect(screen.getByLabelText('Stop Loss')).toHaveValue(stopLoss);
  expect(screen.getByLabelText('Take profit')).toBeEnabled();
  expect(screen.getByLabelText('Take profit')).toHaveValue(takeProfit);
  expect(screen.getByLabelText('Commission')).toBeDisabled();
  expect(screen.getByLabelText('Commission')).toHaveValue(commission);
  expect(screen.getByLabelText('Swaps')).toBeDisabled();
  expect(screen.getByLabelText('Swaps')).toHaveValue(swaps);
  expect(screen.getByLabelText('Floating P/L')).toBeDisabled();
  expect(screen.getByLabelText('Floating P/L')).toHaveValue(floatingPnL);
  expect(screen.getByLabelText('Net Floating P/L')).toBeDisabled();
  expect(screen.getByLabelText('Net Floating P/L')).toHaveValue(netPnL);
  expect(screen.getByLabelText('Margin')).toBeDisabled();
  expect(screen.getByLabelText('Margin')).toHaveValue(margin);
  expect(screen.getByLabelText('Comment')).toBeEnabled();
  expect(screen.getByLabelText('Comment')).toHaveValue(comment);
  expect(screen.queryByTestId('updateOrder')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Cancel order' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Reopen' })).not.toBeInTheDocument();
});

it('Render EditOrderModal with admin edit order permission', async () => {
  const {
    id,
    type,
    volumeLots,
    symbol,
    commission,
    openPrice,
    swaps,
    stopLoss,
    takeProfit,
    comment,
    margin,
    time,
    reason,
    openRate,
    closeRate,
  } = apolloMockResponseData;

  // Arrange
  const floatingPnL = '140.63';
  const netPnL = '140.63';

  const ask = 1.15520;
  const bid = 1.15480;

  const _permissions = [
    permissions.WE_TRADING.ADMIN_EDIT_ORDER,
  ];

  // Act
  render(<EditOrderModal {...props} />, {}, _permissions);

  // Wait for order loading
  await waitForElementToBeRemoved(() => screen.getByText(/Loading.../));

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  await act(async () => {
    // We should wait 500 ms (update interval in useSymbolsStream) to notify component about changes
    await new Promise(res => setTimeout(res, 500));
  });

  expect(screen.getByLabelText('Order')).toBeDisabled();
  expect(screen.getByLabelText('Order')).toHaveValue(`Deal #${id}, ${capitalize(type)} ${volumeLots} ${symbol}`);
  expect(screen.getByLabelText('Open price')).toBeEnabled();
  expect(screen.getByLabelText('Open price')).toHaveValue(openPrice);
  expect(screen.getByLabelText('Open time')).toBeEnabled();
  expect(screen.getByLabelText('Open time')).toHaveValue(
    moment.utc(time.creation).local(false).format('DD.MM.YYYY HH:mm:ss'),
  );
  expect(screen.queryByLabelText('Expiry')).toBeNull();
  expect(screen.getByLabelText('Stop Loss')).toBeEnabled();
  expect(screen.getByLabelText('Stop Loss')).toHaveValue(stopLoss);
  expect(screen.getByLabelText('Take profit')).toBeEnabled();
  expect(screen.getByLabelText('Take profit')).toHaveValue(takeProfit);
  expect(screen.getByLabelText('Commission')).toBeEnabled();
  expect(screen.getByLabelText('Commission')).toHaveValue(commission);
  expect(screen.getByLabelText('Swaps')).toBeEnabled();
  expect(screen.getByLabelText('Swaps')).toHaveValue(swaps);
  expect(screen.getByLabelText('Floating P/L')).toBeDisabled();
  expect(screen.getByLabelText('Floating P/L')).toHaveValue(floatingPnL);
  expect(screen.getByLabelText('Net Floating P/L')).toBeDisabled();
  expect(screen.getByLabelText('Net Floating P/L')).toHaveValue(netPnL);
  expect(screen.getByLabelText('Margin')).toBeDisabled();
  expect(screen.getByLabelText('Margin')).toHaveValue(margin);
  expect(screen.getByLabelText('Comment')).toBeEnabled();
  expect(screen.getByLabelText('Comment')).toHaveValue(comment);
  expect(screen.queryByTestId('updateOrder')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Cancel order' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Reopen' })).not.toBeInTheDocument();

  // Admin fields depends on admin edit permissions
  expect(screen.getByLabelText('Reason')).toBeEnabled();
  expect(screen.getByLabelText('Reason')).toHaveValue(reason);
  expect(screen.getByLabelText('Volume')).toBeEnabled();
  expect(screen.getByLabelText('Volume')).toHaveValue(volumeLots);
  expect(screen.getByLabelText('Symbol')).toBeDisabled();
  expect(screen.getByLabelText('Symbol')).toHaveValue(symbol);
  expect(screen.getByLabelText('Close Price')).toBeDisabled();
  expect(screen.getByLabelText('Close Price')).toHaveValue(bid);
  expect(screen.getByLabelText('Open conversation rate')).toBeDisabled();
  expect(screen.getByLabelText('Open conversation rate')).toHaveValue(openRate);
  expect(screen.getByLabelText('Close conversation rate')).toBeDisabled();
  expect(screen.getByLabelText('Close conversation rate')).toHaveValue(closeRate);
});

it('Render EditOrderModal with cancel order permission for OPEN order', async () => {
  const {
    id,
    type,
    volumeLots,
    symbol,
    commission,
    openPrice,
    swaps,
    stopLoss,
    takeProfit,
    comment,
    margin,
    time,
  } = apolloMockResponseData;

  // Arrange
  const floatingPnL = '140.63';
  const netPnL = '140.63';

  const ask = 1.15520;
  const bid = 1.15480;

  const _permissions = [
    permissions.WE_TRADING.ORDER_CANCEL,
  ];

  // Act
  render(<EditOrderModal {...props} />, {}, _permissions);

  // Wait for order loading
  await waitForElementToBeRemoved(() => screen.getByText(/Loading.../));

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  await act(async () => {
    // We should wait 500 ms (update interval in useSymbolsStream) to notify component about changes
    await new Promise(res => setTimeout(res, 500));
  });

  expect(screen.getByLabelText('Order')).toBeDisabled();
  expect(screen.getByLabelText('Order')).toHaveValue(`Deal #${id}, ${capitalize(type)} ${volumeLots} ${symbol}`);
  expect(screen.getByLabelText('Open price')).toBeDisabled();
  expect(screen.getByLabelText('Open price')).toHaveValue(openPrice);
  expect(screen.getByLabelText('Open time')).toBeDisabled();
  expect(screen.getByLabelText('Open time')).toHaveValue(
    moment.utc(time.creation).local(false).format('DD.MM.YYYY HH:mm:ss'),
  );
  expect(screen.queryByLabelText('Expiry')).toBeNull();
  expect(screen.getByLabelText('Stop Loss')).toBeDisabled();
  expect(screen.getByLabelText('Stop Loss')).toHaveValue(stopLoss);
  expect(screen.getByLabelText('Take profit')).toBeDisabled();
  expect(screen.getByLabelText('Take profit')).toHaveValue(takeProfit);
  expect(screen.getByLabelText('Commission')).toBeDisabled();
  expect(screen.getByLabelText('Commission')).toHaveValue(commission);
  expect(screen.getByLabelText('Swaps')).toBeDisabled();
  expect(screen.getByLabelText('Swaps')).toHaveValue(swaps);
  expect(screen.getByLabelText('Floating P/L')).toBeDisabled();
  expect(screen.getByLabelText('Floating P/L')).toHaveValue(floatingPnL);
  expect(screen.getByLabelText('Net Floating P/L')).toBeDisabled();
  expect(screen.getByLabelText('Net Floating P/L')).toHaveValue(netPnL);
  expect(screen.getByLabelText('Margin')).toBeDisabled();
  expect(screen.getByLabelText('Margin')).toHaveValue(margin);
  expect(screen.getByLabelText('Comment')).toBeDisabled();
  expect(screen.getByLabelText('Comment')).toHaveValue(comment);
  expect(screen.queryByTestId('updateOrder')).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Cancel order' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Cancel order' })).toBeEnabled();
  expect(screen.queryByRole('button', { name: 'Reopen' })).not.toBeInTheDocument();
});

it('Render EditOrderModal with reopen order permission for CLOSED order for MANAGER', async () => {
  const {
    id,
    type,
    volumeLots,
    symbol,
    commission,
    openPrice,
    swaps,
    stopLoss,
    takeProfit,
    comment,
    margin,
    time,
  } = apolloMockResponseData;

  // Arrange
  const floatingPnL = '140.63';
  const netPnL = '140.63';

  const ask = 1.15520;
  const bid = 1.15480;

  const order = {
    status: 'CLOSED',
    pnl: {
      net: Number(netPnL),
      gross: Number(floatingPnL),
    },
  };

  const _permissions = [
    permissions.WE_TRADING.MANAGER_EDIT_ORDER,
    permissions.WE_TRADING.ORDER_REOPEN,
  ];

  // Act
  render(<EditOrderModal {...props} />, order, _permissions);

  // Wait for order loading
  await waitForElementToBeRemoved(() => screen.getByText(/Loading.../));

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  await act(async () => {
    // We should wait 500 ms (update interval in useSymbolsStream) to notify component about changes
    await new Promise(res => setTimeout(res, 500));
  });

  expect(screen.getByLabelText('Order')).toBeDisabled();
  expect(screen.getByLabelText('Order')).toHaveValue(`Deal #${id}, ${capitalize(type)} ${volumeLots} ${symbol}`);
  expect(screen.getByLabelText('Open price')).toBeDisabled();
  expect(screen.getByLabelText('Open price')).toHaveValue(openPrice);
  expect(screen.getByLabelText('Open time')).toBeDisabled();
  expect(screen.getByLabelText('Open time')).toHaveValue(
    moment.utc(time.creation).local(false).format('DD.MM.YYYY HH:mm:ss'),
  );
  expect(screen.queryByLabelText('Expiry')).toBeNull();
  expect(screen.getByLabelText('Stop Loss')).toBeDisabled();
  expect(screen.getByLabelText('Stop Loss')).toHaveValue(stopLoss);
  expect(screen.getByLabelText('Take profit')).toBeDisabled();
  expect(screen.getByLabelText('Take profit')).toHaveValue(takeProfit);
  expect(screen.getByLabelText('Commission')).toBeDisabled();
  expect(screen.getByLabelText('Commission')).toHaveValue(commission);
  expect(screen.getByLabelText('Swaps')).toBeDisabled();
  expect(screen.getByLabelText('Swaps')).toHaveValue(swaps);
  expect(screen.getByLabelText('Floating P/L')).toBeDisabled();
  expect(screen.getByLabelText('Floating P/L')).toHaveValue(floatingPnL);
  expect(screen.getByLabelText('Net Floating P/L')).toBeDisabled();
  expect(screen.getByLabelText('Net Floating P/L')).toHaveValue(netPnL);
  expect(screen.getByLabelText('Margin')).toBeDisabled();
  expect(screen.getByLabelText('Margin')).toHaveValue(margin);
  expect(screen.getByLabelText('Comment')).toBeDisabled();
  expect(screen.getByLabelText('Comment')).toHaveValue(comment);
  expect(screen.getByTestId('updateOrder')).toBeDisabled();
  expect(screen.queryByRole('button', { name: 'Cancel order' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Reopen' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Reopen' })).toBeEnabled();
});

it('Render EditOrderModal with reopen order permission for CLOSED order for ADMIN', async () => {
  const {
    id,
    type,
    volumeLots,
    symbol,
    commission,
    openPrice,
    swaps,
    stopLoss,
    takeProfit,
    comment,
    margin,
    openRate,
    closeRate,
  } = apolloMockResponseData;

  // Arrange
  const floatingPnL = '140.63';
  const netPnL = '140.63';

  const ask = 1.15520;
  const bid = 1.15480;

  const order = {
    status: 'CLOSED',
    closePrice: 1.1360,
    pnl: {
      net: Number(netPnL),
      gross: Number(floatingPnL),
    },
    time: {
      closing: '2021-11-19T15:13:19.29864',
      creation: '2021-11-18T15:13:19.29864',
      expiration: null,
      modification: null,
    },
  };

  const _permissions = [
    permissions.WE_TRADING.ADMIN_EDIT_ORDER,
    permissions.WE_TRADING.ORDER_REOPEN,
  ];

  // Act
  render(<EditOrderModal {...props} />, order, _permissions);

  // Wait for order loading
  await waitForElementToBeRemoved(() => screen.getByText(/Loading.../));

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  await act(async () => {
    // We should wait 500 ms (update interval in useSymbolsStream) to notify component about changes
    await new Promise(res => setTimeout(res, 500));
  });

  expect(screen.getByLabelText('Order')).toBeDisabled();
  expect(screen.getByLabelText('Order')).toHaveValue(`Deal #${id}, ${capitalize(type)} ${volumeLots} ${symbol}`);
  expect(screen.getByLabelText('Open price')).toBeEnabled();
  expect(screen.getByLabelText('Open price')).toHaveValue(openPrice);
  expect(screen.getByLabelText('Open time')).toBeEnabled();
  expect(screen.getByLabelText('Open time')).toHaveValue(
    moment.utc(order.time.creation).local(false).format('DD.MM.YYYY HH:mm:ss'),
  );
  expect(screen.queryByLabelText('Expiry')).toBeNull();
  expect(screen.getByLabelText('Stop Loss')).toBeEnabled();
  expect(screen.getByLabelText('Stop Loss')).toHaveValue(stopLoss);
  expect(screen.getByLabelText('Take profit')).toBeEnabled();
  expect(screen.getByLabelText('Take profit')).toHaveValue(takeProfit);
  expect(screen.getByLabelText('Close Price')).toBeEnabled();
  expect(screen.getByLabelText('Close Price')).toHaveValue(order.closePrice);
  expect(screen.getByLabelText('Close time')).toBeEnabled();
  expect(screen.getByLabelText('Close time')).toHaveValue(
    moment.utc(order.time.closing).local(false).format('DD.MM.YYYY HH:mm:ss'),
  );
  expect(screen.getByLabelText('Open conversation rate')).toBeDisabled();
  expect(screen.getByLabelText('Open conversation rate')).toHaveValue(openRate);
  expect(screen.getByLabelText('Close conversation rate')).toBeDisabled();
  expect(screen.getByLabelText('Close conversation rate')).toHaveValue(closeRate);
  expect(screen.getByLabelText('Commission')).toBeEnabled();
  expect(screen.getByLabelText('Commission')).toHaveValue(commission);
  expect(screen.getByLabelText('Swaps')).toBeEnabled();
  expect(screen.getByLabelText('Swaps')).toHaveValue(swaps);
  expect(screen.getByLabelText('Floating P/L')).toBeDisabled();
  expect(screen.getByLabelText('Floating P/L')).toHaveValue(floatingPnL);
  expect(screen.getByLabelText('Net Floating P/L')).toBeDisabled();
  expect(screen.getByLabelText('Net Floating P/L')).toHaveValue(netPnL);
  expect(screen.getByLabelText('Margin')).toBeDisabled();
  expect(screen.getByLabelText('Margin')).toHaveValue(margin);
  expect(screen.getByLabelText('Comment')).toBeEnabled();
  expect(screen.getByLabelText('Comment')).toHaveValue(comment);
  expect(screen.getByTestId('updateOrder')).toBeDisabled();
  expect(screen.queryByRole('button', { name: 'Cancel order' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Reopen' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Reopen' })).toBeEnabled();
});

it('Render EditOrderModal order with Expiry dаte', async () => {
  const ORDER_WITH_EXPIRY_DATE = {
    ...apolloMockResponseData,
    time: {
      ...apolloMockResponseData.time,
      expiration: '2021-11-04T17:41:11.829',
    },
  };

  // Act
  render(<EditOrderModal {...props} />, ORDER_WITH_EXPIRY_DATE);

  // Wait for order loading
  await waitForElementToBeRemoved(() => screen.getByText(/Loading.../));

  expect(screen.getByLabelText('Expiry')).toHaveValue(
    moment.utc(ORDER_WITH_EXPIRY_DATE.time.expiration).local().format('DD.MM.YYYY HH:mm:ss'),
  );
  expect(screen.getByLabelText('Expiry')).toBeDisabled();
});

it('Render EditOrderModal for OPEN order with BUY type', async () => {
  const { volumeLots } = apolloMockResponseData;

  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  const pnl = '140.63';

  const newAsk = 1.1555;
  const newBid = 1.1545;

  const _permissions = [permissions.WE_TRADING.ORDER_CLOSE];

  // Act
  render(<EditOrderModal {...props} />, {}, _permissions);

  // Wait for order loading
  await waitForElementToBeRemoved(() => screen.getByText(/Loading.../));

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await waitFor(() => screen.getByText(`Close ${volumeLots} at ${bid.toFixed(5)}`));

  expect(screen.getByLabelText('Volume')).toHaveValue(volumeLots);
  expect(screen.getByLabelText('Volume')).toBeEnabled();
  expect(screen.getByTestId('closePrice')).toHaveValue(bid);
  expect(screen.getByTestId('PnL')).toHaveTextContent(pnl);

  const updateButton = screen.getByRole('button', { name: 'Update' });
  expect(updateButton).toBeInTheDocument();
  await waitFor(() => expect(updateButton).toBeEnabled());

  await act(async () => {
    // Wait while rsocket tick will be accepted by component
    MockedRSocketProvider.publish(rsocketMockFactory({ ask: newAsk, bid: newBid }));
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  fireEvent.click(updateButton);

  await waitFor(() => screen.getByText(`Close ${volumeLots} at ${newBid.toFixed(5)}`));
  expect(screen.getByTestId('closePrice')).toHaveValue(newBid);
});

it('Render EditOrderModal for OPEN order with SELL type', async () => {
  const SELL_ORDER_TYPE = {
    ...apolloMockResponseData,
    type: 'SELL',
    direction: 'SELL',
  };
  const { volumeLots } = apolloMockResponseData;

  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  const pnl = '-143.40';

  const newAsk = 1.1555;
  const newBid = 1.1545;

  const _permissions = [permissions.WE_TRADING.ORDER_CLOSE];

  // Act
  render(<EditOrderModal {...props} />, SELL_ORDER_TYPE, _permissions);

  // Wait for order loading
  await waitForElementToBeRemoved(() => screen.getByText(/Loading.../));

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await waitFor(() => screen.getByText(`Close ${volumeLots} at ${ask.toFixed(5)}`));

  expect(screen.getByLabelText('Volume')).toHaveValue(volumeLots);
  expect(screen.getByLabelText('Volume')).toBeEnabled();
  expect(screen.getByTestId('closePrice')).toHaveValue(ask);
  expect(screen.getByTestId('PnL')).toHaveTextContent(pnl);

  const updateButton = screen.getByRole('button', { name: 'Update' });
  expect(updateButton).toBeInTheDocument();
  await waitFor(() => expect(updateButton).toBeEnabled());

  await act(async () => {
    // Wait while rsocket tick will be accepted by component
    MockedRSocketProvider.publish(rsocketMockFactory({ ask: newAsk, bid: newBid }));
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  fireEvent.click(updateButton);

  await waitFor(() => screen.getByText(`Close ${volumeLots} at ${newAsk.toFixed(5)}`));
  expect(screen.getByTestId('closePrice')).toHaveValue(newAsk);
});

it('Render EditOrderModal for PENDING order with BUY type', async () => {
  const SELL_ORDER_TYPE = {
    ...apolloMockResponseData,
    direction: 'BUY',
    status: 'PENDING',
    tradeType: 'LIMIT',
    type: 'BUY_LIMIT',
    stopLoss: 1.12548,
    takeProfit: 1.17338,
  };
  const { volumeLots, openPrice } = apolloMockResponseData;

  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  const newAsk = 1.1555;
  const newBid = 1.1545;

  const _permissions = [permissions.WE_TRADING.ORDER_ACTIVATE];

  // Act
  render(<EditOrderModal {...props} />, SELL_ORDER_TYPE, _permissions);

  // Wait for order loading
  await waitForElementToBeRemoved(() => screen.getByText(/Loading.../));

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Activate ${volumeLots} at ${openPrice.toFixed(5)}`);

  expect(screen.getByLabelText('Volume')).toHaveValue(volumeLots);
  expect(screen.getByLabelText('Volume')).toBeDisabled();
  expect(screen.getByTestId('activationPrice')).toHaveValue(openPrice);
  const updateButton = screen.getByRole('button', { name: 'Update' });
  expect(updateButton).toBeInTheDocument();
  await waitFor(() => expect(updateButton).toBeEnabled());

  await act(async () => {
    // Wait while rsocket tick will be accepted by component
    MockedRSocketProvider.publish(rsocketMockFactory({ ask: newAsk, bid: newBid }));
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  fireEvent.click(updateButton);

  await waitFor(() => screen.getByText(`Activate ${volumeLots} at ${newAsk.toFixed(5)}`));
  expect(screen.getByTestId('activationPrice')).toHaveValue(newAsk);
});

it('Render EditOrderModal for PENDING order with SELL type', async () => {
  const SELL_ORDER_TYPE = {
    ...apolloMockResponseData,
    direction: 'SELL',
    status: 'PENDING',
    tradeType: 'LIMIT',
    type: 'SELL_LIMIT',
    stopLoss: 1.12548,
    takeProfit: 1.17338,
  };
  const { volumeLots, openPrice } = apolloMockResponseData;

  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  const newAsk = 1.1555;
  const newBid = 1.1545;

  const _permissions = [permissions.WE_TRADING.ORDER_ACTIVATE];

  // Act
  render(<EditOrderModal {...props} />, SELL_ORDER_TYPE, _permissions);

  // Wait for order loading
  await waitForElementToBeRemoved(() => screen.getByText(/Loading.../));

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await waitFor(() => screen.getByText(`Activate ${volumeLots} at ${openPrice.toFixed(5)}`));

  expect(screen.getByLabelText('Volume')).toHaveValue(volumeLots);
  expect(screen.getByLabelText('Volume')).toBeDisabled();
  expect(screen.getByTestId('activationPrice')).toHaveValue(openPrice);
  const updateButton = screen.getByRole('button', { name: 'Update' });
  expect(updateButton).toBeInTheDocument();
  await waitFor(() => expect(updateButton).toBeEnabled());

  await act(async () => {
    // Wait while rsocket tick will be accepted by component
    MockedRSocketProvider.publish(rsocketMockFactory({ ask: newAsk, bid: newBid }));
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  fireEvent.click(updateButton);

  await waitFor(() => screen.getByText(`Activate ${volumeLots} at ${newBid.toFixed(5)}`));
  expect(screen.getByTestId('activationPrice')).toHaveValue(newBid);
});

it('Render EditOrderModal and configure volumeLots field for partial close order', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;
  const { volumeLots } = apolloMockResponseData;

  const _permissions = [permissions.WE_TRADING.ORDER_CLOSE];

  // Act
  render(<EditOrderModal {...props} />, {}, _permissions);

  // Wait for order loading
  await waitForElementToBeRemoved(() => screen.getByText(/Loading.../));

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await waitFor(() => screen.getByText(`Close ${volumeLots} at ${bid.toFixed(5)}`));

  expect(screen.getByLabelText(/Volume/)).toBeEnabled();
  expect(screen.getByLabelText(/Volume/)).toHaveValue(volumeLots);
  expect(screen.getByLabelText(/Volume/)).toHaveAttribute('min', '0.01');
  expect(screen.getByLabelText(/Volume/)).toHaveAttribute('max', volumeLots.toString());
  expect(screen.getByLabelText(/Volume/)).toHaveAttribute('step', '0.01');

  fireEvent.change(screen.getByLabelText('Volume'), { target: { value: 0.001 } });
  await screen.findAllByText(/The Volume must be at least 0.01./);
  expect(screen.getByText(`Close 0.00 at ${bid.toFixed(5)}`)).toBeDisabled();

  fireEvent.change(screen.getByLabelText('Volume'), { target: { value: 10001 } });
  await screen.findAllByText(`The Volume may not be greater than ${volumeLots}.`);
  expect(screen.getByText(`Close 10001.00 at ${bid.toFixed(5)}`)).toBeDisabled();

  fireEvent.change(screen.getByLabelText('Volume'), { target: { value: 0.012 } });
  await screen.findAllByText(/The Volume must be changed with step 0.01/);
  expect(screen.getByText(`Close 0.01 at ${bid.toFixed(5)}`)).toBeDisabled();
});
