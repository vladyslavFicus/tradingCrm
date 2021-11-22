import React from 'react';
import { render as testingLibraryRender, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from 'react-apollo/test-utils';
import StorageProvider from 'providers/StorageProvider';
import CoreLayout from 'layouts/CoreLayout';
import { MockedRSocketProvider } from 'rsocket';
import capitalize from 'utils/capitalize';
import { REQUEST as OrderQuery } from './graphql/OrderQuery';
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
    currency: "EUR",
    __typename: "TradingEngineAccount"
  },
  accountLogin: 144354,
  accountUuid: "WET-4fdfd959-e853-4cca-bfc8-6469fa6acd16",
  closePrice: null,
  comment: "",
  commission: 0,
  digits: 5,
  direction: "BUY",
  groupSpread: {
    bidAdjustment: 0,
    askAdjustment: 0,
    __typename: "TradingEngineGroupSpread"
  },
  id: 143749,
  lotSize: 100000,
  marginRate: null,
  openPrice: 1.1345,
  status: "OPEN",
  stopLoss: null,
  swaps: 0,
  symbol: "EURUSD",
  symbolAlias: "EURUSD",
  symbolEntity: {
    lotSize: 100000,
    __typename: "TradingEngineSymbol"
  },
  takeProfit: null,
  time: {
    closing: null,
    creation: "2021-11-18T15:13:19.29864",
    expiration: null,
    modification: null,
    __typename: "TradingEngineOrder__Time",
  },
  tradeType: "MARKET",
  type: "BUY",
  volumeLots: 0.01,
  volumeUnits: 1000,
}

// Define mocks for Apollo
const apolloMockFactory = (data = {}) => [{
  request: {
    query: OrderQuery,
    variables: { orderId: props.id },
  },
  result: {
    data: {
      tradingEngineOrder: {
        ...apolloMockResponseData,
        ...data,
      }
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
const render = (component: React.ReactElement, apolloMockData = {}) => testingLibraryRender(
  <BrowserRouter>
    <StorageProvider>
      <MockedProvider mocks={apolloMockFactory(apolloMockData)} addTypename={false}>
        <MockedRSocketProvider>
          <CoreLayout>
            {component}
          </CoreLayout>
        </MockedRSocketProvider>
      </MockedProvider>
    </StorageProvider>
  </BrowserRouter>,
);

it('Render EditOrderModal', async () => {
  const {
    id,
    type,
    volumeLots,
    symbol,
  } = apolloMockResponseData;

  // Arrange
  const ask = 1.15520;
  const bid = 1.15480;

  // Act
  render(<EditOrderModal {...props} />);

  // Wait for order loading
  await screen.findByText(/Deal/);

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Assert for order info
  expect(screen.getByLabelText('Order')).toBeDisabled();
  expect(screen.getByLabelText('Order')).toHaveValue(
    `Deal #${id}, ${capitalize(type)} ${volumeLots} ${symbol}`
  );

  expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  expect(screen.getByLabelText('Open time')).toBeDisabled();
  expect(screen.getByLabelText('Commission')).toBeDisabled();
  expect(screen.getByLabelText('Open price')).toBeInTheDocument();
  expect(screen.getByLabelText('R/O Swaps')).toBeDisabled();
  expect(screen.getByLabelText('Stop Loss')).toBeInTheDocument();
  expect(screen.getByLabelText('Take profit')).toBeInTheDocument();
  expect(screen.getByLabelText('Floating P/L')).toBeDisabled();
  expect(screen.getByLabelText('Net Floating P/L')).toBeDisabled();
  expect(screen.getByLabelText('Comment')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Change' })).toBeInTheDocument();
});

it('Render EditOrderModal order with Expiry dete', async () => {
  const ORDER_WITH_EXPIRY_DATE = {
    ...apolloMockResponseData,
    time: {
      ...apolloMockResponseData.time,
      expiration: '2021-11-04T17:41:11.829',
    }
  }

  // Act
  render(<EditOrderModal {...props} />, ORDER_WITH_EXPIRY_DATE);

  // Wait for order loading
  await screen.findByText(/Deal/);

  expect(screen.getByLabelText('Expiry')).toBeDisabled();
});

it('Render EditOrderModal for OPEN order with BUY type', async () => {
  const { volumeLots } = apolloMockResponseData;

  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  // Act
  render(<EditOrderModal {...props} />);

  // Wait for order loading
  await screen.findByText(/Deal/);

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Close ${volumeLots} at ${bid.toFixed(5)}`);

  expect(screen.getByLabelText('Volume')).toHaveValue(volumeLots)
  expect(screen.getByLabelText('Volume')).toBeDisabled();
  expect(screen.getByTestId('closePrice')).toHaveValue(bid);
  expect(screen.getByTestId('PnL')).not.toBeEmptyDOMElement();

  const updateButton = screen.getByRole('button', { name: 'Update' });
  expect(updateButton).toBeInTheDocument();
  await waitFor(() => expect(updateButton).toBeEnabled());

  fireEvent.click(updateButton);
  await waitFor(() => screen.findByText(`Close ${volumeLots} at ${bid.toFixed(5)}`));
  expect(screen.getByTestId('closePrice')).toHaveValue(bid);
});

it('Render EditOrderModal for OPEN order with SELL type', async () => {
  const SELL_ORDER_TYPE = {
    ...apolloMockResponseData,
    type: "SELL",
    direction: "SELL"
  }
  const { volumeLots } = apolloMockResponseData;

  // Arrange
  const ask = 1.1554;
  const bid = 1.1544;

  // Act
  render(<EditOrderModal {...props} />, SELL_ORDER_TYPE);

  // Wait for order loading
  await screen.findByText(/Deal/);

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Close ${volumeLots} at ${ask.toFixed(5)}`);

  expect(screen.getByLabelText('Volume')).toHaveValue(volumeLots)
  expect(screen.getByLabelText('Volume')).toBeDisabled();
  expect(screen.getByTestId('closePrice')).toHaveValue(ask);
  expect(screen.getByTestId('PnL')).not.toBeEmptyDOMElement();

  const updateButton = screen.getByRole('button', { name: 'Update' });
  expect(updateButton).toBeInTheDocument();
  await waitFor(() => expect(updateButton).toBeEnabled());

  fireEvent.click(updateButton);
  await waitFor(() => screen.findByText(`Close ${volumeLots} at ${ask.toFixed(5)}`));
  expect(screen.getByTestId('closePrice')).toHaveValue(ask);
});

it('Render EditOrderModal for PENDING order with BUY type', async () => {
  const SELL_ORDER_TYPE = {
    ...apolloMockResponseData,
    direction: "BUY",
    status: "PENDING",
    tradeType: "LIMIT",
    type: "BUY_LIMIT",
    stopLoss: 1.12548,
    takeProfit: 1.17338,
  }
  const { volumeLots, openPrice } = apolloMockResponseData;

  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  // Act
  render(<EditOrderModal {...props} />, SELL_ORDER_TYPE);

  // Wait for order loading
  await screen.findByText(/Deal/);

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Activate ${volumeLots} at ${openPrice.toFixed(5)}`);

  expect(screen.getByLabelText('Volume')).toHaveValue(volumeLots)
  expect(screen.getByLabelText('Volume')).toBeDisabled();
  expect(screen.getByTestId('activationPrice')).toHaveValue(openPrice);
  const updateButton = screen.getByRole('button', { name: 'Update' });
  expect(updateButton).toBeInTheDocument();
  await waitFor(() => expect(updateButton).toBeEnabled());

  fireEvent.click(updateButton);
  await waitFor(() => screen.findByText(`Activate ${volumeLots} at ${ask.toFixed(5)}`));
  expect(screen.getByTestId('activationPrice')).toHaveValue(ask);
});

it('Render EditOrderModal for PENDING order with SELL type', async () => {
  const SELL_ORDER_TYPE = {
    ...apolloMockResponseData,
    direction: "SELL",
    status: "PENDING",
    tradeType: "LIMIT",
    type: "SELL_LIMIT",
    stopLoss: 1.12548,
    takeProfit: 1.17338,
  }
  const { volumeLots, openPrice } = apolloMockResponseData;

  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  // Act
  render(<EditOrderModal {...props} />, SELL_ORDER_TYPE);

  // Wait for order loading
  await screen.findByText(/Deal/);

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Activate ${volumeLots} at ${openPrice.toFixed(5)}`);

  expect(screen.getByLabelText('Volume')).toHaveValue(volumeLots)
  expect(screen.getByLabelText('Volume')).toBeDisabled();
  expect(screen.getByTestId('activationPrice')).toHaveValue(openPrice);
  const updateButton = screen.getByRole('button', { name: 'Update' });
  expect(updateButton).toBeInTheDocument();
  await waitFor(() => expect(updateButton).toBeEnabled());

  fireEvent.click(updateButton);
  await screen.findByText(`Activate ${volumeLots} at ${ask.toFixed(5)}`);
  expect(screen.getByTestId('activationPrice')).toHaveValue(ask);
});
