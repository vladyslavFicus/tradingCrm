import React from 'react';
import { render as testingLibraryRender, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from 'react-apollo/test-utils';
import StorageProvider from 'providers/StorageProvider';
import CoreLayout from 'layouts/CoreLayout';
import { MockedRSocketProvider } from 'rsocket';
import { round } from 'utils/round';
import TradingEngineAccountQuery from './graphql/TradingEngineAccountQuery';
import CommonNewOrderModal from './CommonNewOrderModal';

// Mocks
jest.mock('components/SymbolChart', () => () => null);

// Define props for NewOrderModal
const props = {
  isOpen: true,
  onCloseModal: () => null,
  onSuccess: () => null,
  notify: () => null,
};

// Define mocks for Apollo
const apolloMockFactory = (data = {}) => [{
  request: {
    query: TradingEngineAccountQuery,
    variables: { identifier: 'UUID' },
  },
  result: {
    data: {
      tradingEngineAccount: {
        _id: 'UUID',
        uuid: 'UUID',
        name: 'My USD account',
        group: 'USD_GROUP',
        accountType: 'LIVE',
        credit: 4.11,
        balance: 100.53,
        login: 100,
        currency: 'USD',
        allowedSymbols: [{
          name: 'EURUSD',
          description: 'EURUSD description',
          digits: 5,
          lotSize: 10000,
          groupSpread: {
            bidAdjustment: 0,
            askAdjustment: 0,
          },
        }],
      },
      ...data,
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

it('Render CommonNewOrderModal and wait for symbols and ticks from rsocket', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  // Act
  render(<CommonNewOrderModal {...props} />);

  fireEvent.change(screen.getByLabelText('Login'), { target: { value: 'UUID' } });
  fireEvent.click(screen.getByRole('button', { name: 'Upload' }));

  // Wait for symbols loading
  await screen.findAllByText(/EURUSD description/);

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Sell at ${bid.toFixed(5)}`);

  // Assert
  expect(screen.getByText(`Sell at ${bid.toFixed(5)}`)).toBeInTheDocument();
  expect(screen.getByText(`Buy at ${ask.toFixed(5)}`)).toBeInTheDocument();
  expect(screen.getByText(`Sell at ${bid.toFixed(5)}`)).toBeEnabled();
  expect(screen.getByText(`Buy at ${ask.toFixed(5)}`)).toBeEnabled();
  expect(screen.getByLabelText('Open price')).toHaveValue(bid);
  expect(screen.getByLabelText('Open price')).toBeDisabled();
});

it('Render CommonNewOrderModal and click on "Auto" checkbox', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  // Act
  render(<CommonNewOrderModal {...props} />);

  fireEvent.change(screen.getByLabelText('Login'), { target: { value: 'UUID' } });
  fireEvent.click(screen.getByRole('button', { name: 'Upload' }));

  // Wait for symbols loading
  await screen.findAllByText(/EURUSD description/);

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Sell at ${bid.toFixed(5)}`);

  // Assert
  expect(screen.getByLabelText(/Auto/)).toBeChecked();
  expect(screen.getByLabelText(/Open price/)).toBeDisabled();
  expect(screen.getByLabelText(/Pending order/)).not.toBeChecked();

  fireEvent.click(screen.getByLabelText(/Auto/));

  expect(screen.getByLabelText(/Auto/)).not.toBeChecked();
  expect(screen.getByLabelText(/Open price/)).toBeEnabled();
  expect(screen.getByLabelText(/Pending order/)).not.toBeChecked();
});

it('Render CommonNewOrderModal and click on "Pending order" checkbox', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  // Act
  render(<CommonNewOrderModal {...props} />);

  fireEvent.change(screen.getByLabelText('Login'), { target: { value: 'UUID' } });
  fireEvent.click(screen.getByRole('button', { name: 'Upload' }));

  // Wait for symbols loading
  await screen.findAllByText(/EURUSD description/);

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Sell at ${bid.toFixed(5)}`);

  // Assert
  expect(screen.getByLabelText(/Auto/)).toBeChecked();
  expect(screen.getByLabelText(/Auto/)).toBeEnabled();
  expect(screen.getByLabelText(/Open price/)).toBeDisabled();
  expect(screen.getByLabelText(/Pending order/)).not.toBeChecked();
  expect(screen.getByLabelText(/Sell P&L/)).toBeInTheDocument();
  expect(screen.getByLabelText(/Buy P&L/)).toBeInTheDocument();

  fireEvent.click(screen.getByLabelText(/Pending order/));

  expect(screen.getByLabelText(/Pending order/)).toBeChecked();
  expect(screen.getByLabelText(/Auto/)).not.toBeChecked();
  expect(screen.getByLabelText(/Auto/)).toBeDisabled();
  expect(screen.getByLabelText(/Open price/)).toBeEnabled();
  expect(screen.queryByLabelText(/Sell P&L/)).not.toBeInTheDocument();
  expect(screen.queryByLabelText(/Buy P&L/)).not.toBeInTheDocument();

  // Sell and Buy buttons should have openPrice value in text
  // Should be disabled cause openPrice === sellPrice and it can't be executable for pending order
  expect(screen.getByText(`Sell at ${bid.toFixed(5)}`)).toBeDisabled();

  // Buy button should have Buy Limit order type and bid (openPrice) value
  expect(screen.getByText(`Buy Limit at ${bid.toFixed(5)}`)).toBeEnabled();
});

it('Render CommonNewOrderModal and click on "Pending order" checkbox double times', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  // Act
  render(<CommonNewOrderModal {...props} />);

  fireEvent.change(screen.getByLabelText('Login'), { target: { value: 'UUID' } });
  fireEvent.click(screen.getByRole('button', { name: 'Upload' }));

  // Wait for symbols loading
  await screen.findAllByText(/EURUSD description/);

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Sell at ${bid.toFixed(5)}`);

  // Assert
  expect(screen.getByLabelText(/Auto/)).toBeChecked();
  expect(screen.getByLabelText(/Auto/)).toBeEnabled();
  expect(screen.getByLabelText(/Open price/)).toBeDisabled();
  expect(screen.getByLabelText(/Pending order/)).not.toBeChecked();

  fireEvent.click(screen.getByLabelText(/Pending order/));

  expect(screen.getByLabelText(/Pending order/)).toBeChecked();
  expect(screen.getByLabelText(/Auto/)).not.toBeChecked();
  expect(screen.getByLabelText(/Auto/)).toBeDisabled();
  expect(screen.getByLabelText(/Open price/)).toBeEnabled();

  fireEvent.click(screen.getByLabelText(/Pending order/));

  expect(screen.getByLabelText(/Pending order/)).not.toBeChecked();
  expect(screen.getByLabelText(/Auto/)).not.toBeChecked();
  expect(screen.getByLabelText(/Auto/)).toBeEnabled();
  expect(screen.getByLabelText(/Open price/)).toBeEnabled();

  // Sell and Buy buttons should have openPrice value in text
  expect(screen.getByText(`Sell at ${bid.toFixed(5)}`)).toBeEnabled()
  expect(screen.getByText(`Buy at ${bid.toFixed(5)}`)).toBeEnabled();
});

it('Render CommonNewOrderModal and click on "Pending order" checkbox, BID price changed down', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  const newAsk = 1.1552;
  const newBid = 1.1547;

  // Act
  render(<CommonNewOrderModal {...props} />);

  fireEvent.change(screen.getByLabelText('Login'), { target: { value: 'UUID' } });
  fireEvent.click(screen.getByRole('button', { name: 'Upload' }));

  // Wait for symbols loading
  await screen.findAllByText(/EURUSD description/);

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Sell at ${bid.toFixed(5)}`);

  fireEvent.click(screen.getByLabelText(/Pending order/));

  // Publish tick message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask: newAsk, bid: newBid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Sell Limit at ${bid.toFixed(5)}`);

  // Assert
  expect(screen.getByText(`Sell Limit at ${bid.toFixed(5)}`)).toBeEnabled();
  expect(screen.getByText(`Buy Limit at ${bid.toFixed(5)}`)).toBeEnabled();
});

it('Render CommonNewOrderModal and click on "Pending order" checkbox, BID price changed up', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  const newAsk = 1.1552;
  const newBid = 1.1549;

  // Act
  render(<CommonNewOrderModal {...props} />);

  fireEvent.change(screen.getByLabelText('Login'), { target: { value: 'UUID' } });
  fireEvent.click(screen.getByRole('button', { name: 'Upload' }));

  // Wait for symbols loading
  await screen.findAllByText(/EURUSD description/);

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Sell at ${bid.toFixed(5)}`);

  fireEvent.click(screen.getByLabelText(/Pending order/));

  // Publish tick message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask: newAsk, bid: newBid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Sell Stop at ${bid.toFixed(5)}`);

  // Assert
  expect(screen.getByText(`Sell Stop at ${bid.toFixed(5)}`)).toBeEnabled();
  expect(screen.getByText(`Buy Limit at ${bid.toFixed(5)}`)).toBeEnabled();
});

it('Render CommonNewOrderModal and click on "Pending order" checkbox, ASK price changed down', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  const newAsk = 1.1547;
  const newBid = 1.1548;

  // Act
  render(<CommonNewOrderModal {...props} />);

  fireEvent.change(screen.getByLabelText('Login'), { target: { value: 'UUID' } });
  fireEvent.click(screen.getByRole('button', { name: 'Upload' }));

  // Wait for symbols loading
  await screen.findAllByText(/EURUSD description/);

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Sell at ${bid.toFixed(5)}`);

  fireEvent.click(screen.getByLabelText(/Pending order/));

  // Publish tick message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask: newAsk, bid: newBid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Buy Stop at ${bid.toFixed(5)}`);

  // Assert
  expect(screen.getByText(`Sell at ${bid.toFixed(5)}`)).toBeDisabled();
  expect(screen.getByText(`Buy Stop at ${bid.toFixed(5)}`)).toBeEnabled();
});

it('Render CommonNewOrderModal and click on "Pending order" checkbox, ASK price changed up', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  const newAsk = 1.1549;
  const newBid = 1.1548;

  // Act
  render(<CommonNewOrderModal {...props} />);

  fireEvent.change(screen.getByLabelText('Login'), { target: { value: 'UUID' } });
  fireEvent.click(screen.getByRole('button', { name: 'Upload' }));

  // Wait for symbols loading
  await screen.findAllByText(/EURUSD description/);

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Sell at ${bid.toFixed(5)}`);

  fireEvent.click(screen.getByLabelText(/Pending order/));

  // Publish tick message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask: newAsk, bid: newBid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Buy Limit at ${bid.toFixed(5)}`);

  // Assert
  expect(screen.getByText(`Sell at ${bid.toFixed(5)}`)).toBeDisabled();
  expect(screen.getByText(`Buy Limit at ${bid.toFixed(5)}`)).toBeEnabled();
});

it('Render CommonNewOrderModal and click on "Pending order" checkbox, ASK price is equal openPrice', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  const newAsk = 1.1548;
  const newBid = 1.1548;

  // Act
  render(<CommonNewOrderModal {...props} />);

  fireEvent.change(screen.getByLabelText('Login'), { target: { value: 'UUID' } });
  fireEvent.click(screen.getByRole('button', { name: 'Upload' }));

  // Wait for symbols loading
  await screen.findAllByText(/EURUSD description/);

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Sell at ${bid.toFixed(5)}`);

  fireEvent.click(screen.getByLabelText(/Pending order/));

  // Publish tick message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask: newAsk, bid: newBid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Buy at ${bid.toFixed(5)}`);

  // Assert
  expect(screen.getByText(`Sell at ${bid.toFixed(5)}`)).toBeDisabled();
  expect(screen.getByText(`Buy at ${bid.toFixed(5)}`)).toBeDisabled();
});

it('Render CommonNewOrderModal and applying group spread for chosen symbol', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  const askAdjustment = 0.005;
  const bidAdjustment = 0.005;
  const digits = 5;

  const apolloMockResponseData = {
    tradingEngineAccount: {
      _id: 'UUID',
      uuid: 'UUID',
      name: 'My USD account',
      group: 'USD_GROUP',
      accountType: 'LIVE',
      credit: 4.11,
      balance: 100.53,
      login: 100,
      currency: 'USD',
      allowedSymbols: [{
        name: 'EURUSD',
        description: 'EURUSD description',
        digits,
        lotSize: 10000,
        groupSpread: {
          bidAdjustment,
          askAdjustment,
        },
      }],
    },
  };

  // Act
  render(<CommonNewOrderModal {...props} />, apolloMockResponseData);

  fireEvent.change(screen.getByLabelText('Login'), { target: { value: 'UUID' } });
  fireEvent.click(screen.getByRole('button', { name: 'Upload' }));

  // Wait for symbols loading
  await screen.findAllByText(/EURUSD description/);

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  const sellPrice = round(bid - bidAdjustment, digits);
  const buyPrice = round(ask + askAdjustment, digits);

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Sell at ${sellPrice.toFixed(5)}`);

  // Assert
  expect(screen.getByText(`Sell at ${sellPrice.toFixed(5)}`)).toBeInTheDocument();
  expect(screen.getByText(`Buy at ${buyPrice.toFixed(5)}`)).toBeInTheDocument();
  expect(screen.getByLabelText('Open price')).toHaveValue(sellPrice);
});
