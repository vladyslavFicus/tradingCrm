import React from 'react';
import { render as testingLibraryRender, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import StorageProvider from 'providers/StorageProvider';
import CoreLayout from 'layouts/CoreLayout';
import { MockedRSocketProvider } from 'rsocket';
import { round } from 'utils/round';
import { AccountQueryDocument } from './graphql/__generated__/AccountQuery';
import { AccountSymbolsQueryDocument } from './graphql/__generated__/AccountSymbolsQuery';
import NewOrderModal from './NewOrderModal';

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
    query: AccountQueryDocument,
    variables: { identifier: 'UUID' },
  },
  result: {
    data: {
      tradingEngine: {
        account: {
          _id: 'UUID',
          uuid: 'UUID',
          name: 'My USD account',
          group: 'USD_GROUP',
          accountType: 'LIVE',
          credit: 4.11,
          balance: 100.53,
          login: 100,
          currency: 'USD',
          leverage: 100,
          enable: true,
        },
        ...data,
      },
    },
  },
}, {
  request: {
    query: AccountSymbolsQueryDocument,
    variables: { accountUuid: 'UUID' },
  },
  result: {
    data: {
      tradingEngine: {
        accountSymbols: [{
          name: 'EURUSD',
          description: 'EURUSD description',
          digits: 5,
          symbolType: 'FOREX',
          config: {
            lotSize: 10000,
            lotMin: 0.01,
            lotStep: 0.01,
            lotMax: 100,
            bidAdjustment: 0,
            askAdjustment: 0,
            percentage: 100,
          },
        }],
        ...data,
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

it('Render NewOrderModal and wait for symbols and ticks from rsocket', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  // Act
  render(<NewOrderModal {...props} />);

  fireEvent.change(screen.getByLabelText('Login'), { target: { value: 'UUID' } });
  fireEvent.click(screen.getByRole('button', { name: 'Upload' }));

  // Wait for symbols loading
  await screen.findAllByText(/EURUSD description/);

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Sell at ${bid.toFixed(5)}`);

  // Assert
  expect(screen.queryByText('This account is archived')).not.toBeInTheDocument();
  expect(screen.getByText(`Sell at ${bid.toFixed(5)}`)).toBeInTheDocument();
  expect(screen.getByText(`Buy at ${ask.toFixed(5)}`)).toBeInTheDocument();
  expect(screen.getByText(`Sell at ${bid.toFixed(5)}`)).toBeEnabled();
  expect(screen.getByText(`Buy at ${ask.toFixed(5)}`)).toBeEnabled();
  expect(screen.getByLabelText('Open price')).toHaveValue(bid);
  expect(screen.getByLabelText('Open price')).toBeDisabled();
});

it('Render NewOrderModal and click on "Auto" checkbox', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  // Act
  render(<NewOrderModal {...props} />);

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

  await act(async () => {
    fireEvent.click(screen.getByLabelText(/Auto/));
  });

  expect(screen.getByLabelText(/Auto/)).not.toBeChecked();
  expect(screen.getByLabelText(/Open price/)).toBeEnabled();
  expect(screen.getByLabelText(/Pending order/)).not.toBeChecked();
});

it('Render NewOrderModal and click on "Auto" checkbox and "Update" button', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  const newAsk = 1.111;
  const newBid = 1.777;

  // Act
  render(<NewOrderModal {...props} />);

  fireEvent.change(screen.getByLabelText('Login'), { target: { value: 'UUID' } });
  fireEvent.click(screen.getByRole('button', { name: 'Upload' }));

  // Wait for symbols loading
  await screen.findAllByText(/EURUSD description/);

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Sell at ${bid.toFixed(5)}`);

  await act(async () => {
    fireEvent.click(screen.getByLabelText(/Auto/));
  });

  // Publish tick message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask: newAsk, bid: newBid }));

  await act(async () => {
    // We should wait 500 ms (update interval in SymbolPricesStream) to notify component about changes
    await new Promise(res => setTimeout(res, 500));
  });

  fireEvent.click(screen.getByRole('button', { name: 'Update' }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Sell at ${newBid.toFixed(5)}`);

  // Assert
  expect(screen.getByText(`Sell at ${newBid.toFixed(5)}`)).toBeEnabled();
  expect(screen.getByText(`Buy at ${newBid.toFixed(5)}`)).toBeEnabled();
});

it('Render NewOrderModal and click on "Pending order" checkbox', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  // Act
  render(<NewOrderModal {...props} />);

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
  expect(screen.getByLabelText(/Sell required margin/)).toBeInTheDocument();
  expect(screen.getByLabelText(/Sell required margin/)).toHaveValue('1.15');
  expect(screen.getByLabelText(/Buy required margin/)).toBeInTheDocument();
  expect(screen.getByLabelText(/Buy required margin/)).toHaveValue('1.15');

  await act(async () => {
    fireEvent.click(screen.getByLabelText(/Pending order/));
  });

  expect(screen.getByLabelText(/Pending order/)).toBeChecked();
  expect(screen.getByLabelText(/Auto/)).not.toBeChecked();
  expect(screen.getByLabelText(/Auto/)).toBeDisabled();
  expect(screen.getByLabelText(/Open price/)).toBeEnabled();
  expect(screen.queryByLabelText(/Sell P&L/)).not.toBeInTheDocument();
  expect(screen.queryByLabelText(/Buy P&L/)).not.toBeInTheDocument();
  expect(screen.queryByLabelText(/Sell required margin/)).not.toBeInTheDocument();
  expect(screen.queryByLabelText(/Buy required margin/)).not.toBeInTheDocument();

  // Sell and Buy buttons should have openPrice value in text
  // Should be disabled cause openPrice === sellPrice and it can't be executable for pending order
  expect(screen.getByText(`Sell at ${bid.toFixed(5)}`)).toBeDisabled();

  // Buy button should have Buy Limit order type and bid (openPrice) value
  expect(screen.getByText(`Buy Limit at ${bid.toFixed(5)}`)).toBeEnabled();
});

it('Render NewOrderModal and click on "Pending order" checkbox double times', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  // Act
  render(<NewOrderModal {...props} />);

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

  await act(async () => {
    fireEvent.click(screen.getByLabelText(/Pending order/));
  });

  expect(screen.getByLabelText(/Pending order/)).toBeChecked();
  expect(screen.getByLabelText(/Auto/)).not.toBeChecked();
  expect(screen.getByLabelText(/Auto/)).toBeDisabled();
  expect(screen.getByLabelText(/Open price/)).toBeEnabled();

  await act(async () => {
    fireEvent.click(screen.getByLabelText(/Pending order/));
  });

  expect(screen.getByLabelText(/Pending order/)).not.toBeChecked();
  expect(screen.getByLabelText(/Auto/)).not.toBeChecked();
  expect(screen.getByLabelText(/Auto/)).toBeEnabled();
  expect(screen.getByLabelText(/Open price/)).toBeEnabled();

  // Sell and Buy buttons should have openPrice value in text
  expect(screen.getByText(`Sell at ${bid.toFixed(5)}`)).toBeEnabled();
  expect(screen.getByText(`Buy at ${bid.toFixed(5)}`)).toBeEnabled();
});

it('Render NewOrderModal and click on "Pending order" checkbox, BID price changed down', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  const newAsk = 1.1552;
  const newBid = 1.1547;

  // Act
  render(<NewOrderModal {...props} />);

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

it('Render NewOrderModal and click on "Pending order" checkbox, BID price changed up', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  const newAsk = 1.1552;
  const newBid = 1.1549;

  // Act
  render(<NewOrderModal {...props} />);

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

it('Render NewOrderModal and click on "Pending order" checkbox, ASK price changed down', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  const newAsk = 1.1547;
  const newBid = 1.1548;

  // Act
  render(<NewOrderModal {...props} />);

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

it('Render NewOrderModal and click on "Pending order" checkbox, ASK price changed up', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  const newAsk = 1.1549;
  const newBid = 1.1548;

  // Act
  render(<NewOrderModal {...props} />);

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

it('Render NewOrderModal and click on "Pending order" checkbox, ASK price is equal openPrice', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  const newAsk = 1.1548;
  const newBid = 1.1548;

  // Act
  render(<NewOrderModal {...props} />);

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

it('Render NewOrderModal and applying group spread for chosen symbol', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  const askAdjustment = 0.005;
  const bidAdjustment = 0.005;
  const digits = 5;

  const apolloMockResponseData = {
    accountSymbols: [{
      name: 'EURUSD',
      description: 'EURUSD description',
      digits,
      symbolType: 'FOREX',
      config: {
        lotSize: 10000,
        lotMin: 0.01,
        lotStep: 0.01,
        lotMax: 100,
        percentage: 100,
        bidAdjustment,
        askAdjustment,
      },
    }],
  };

  // Act
  render(<NewOrderModal {...props} />, apolloMockResponseData);

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

it('Render NewOrderModal and configure volumeLots field', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  // Act
  render(<NewOrderModal {...props} />);

  fireEvent.change(screen.getByLabelText('Login'), { target: { value: 'UUID' } });
  fireEvent.click(screen.getByRole('button', { name: 'Upload' }));

  // Wait for symbols loading
  await screen.findAllByText(/EURUSD description/);

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Sell at ${bid.toFixed(5)}`);

  expect(screen.getByLabelText(/Volume/)).toBeEnabled();
  expect(screen.getByLabelText(/Volume/)).toHaveValue(0.01);
  expect(screen.getByLabelText(/Volume/)).toHaveAttribute('min', '0.01');
  expect(screen.getByLabelText(/Volume/)).toHaveAttribute('max', '100');
  expect(screen.getByLabelText(/Volume/)).toHaveAttribute('step', '0.01');
  expect(screen.getByText(`Sell at ${bid.toFixed(5)}`)).toBeEnabled();
  expect(screen.getByText(`Buy at ${ask.toFixed(5)}`)).toBeEnabled();

  fireEvent.change(screen.getByLabelText('Volume'), { target: { value: 0.001 } });
  await screen.findAllByText(/The Volume must be at least 0.01./);
  expect(screen.getByText(`Sell at ${bid.toFixed(5)}`)).toBeDisabled();
  expect(screen.getByText(`Buy at ${ask.toFixed(5)}`)).toBeDisabled();

  fireEvent.change(screen.getByLabelText('Volume'), { target: { value: 10001 } });
  await screen.findAllByText(/The Volume may not be greater than 100./);
  expect(screen.getByText(`Sell at ${bid.toFixed(5)}`)).toBeDisabled();
  expect(screen.getByText(`Buy at ${ask.toFixed(5)}`)).toBeDisabled();

  fireEvent.change(screen.getByLabelText('Volume'), { target: { value: 0.012 } });
  await screen.findAllByText(/The Volume must be changed with step 0.01/);
  expect(screen.getByText(`Sell at ${bid.toFixed(5)}`)).toBeDisabled();
  expect(screen.getByText(`Buy at ${ask.toFixed(5)}`)).toBeDisabled();
});

it('Render NewOrderModal without login in props', async () => {
  // Act
  render(<NewOrderModal {...props} />);

  // Assert
  expect(screen.getByLabelText('Login')).toBeEnabled();
  expect(screen.getByRole('button', { name: 'Upload' })).toBeInTheDocument();
});

it('Render NewOrderModal with login in props', async () => {
  // Arrange
  const login = 'UUID';

  // Act
  render(<NewOrderModal {...props} login={login} />);

  // Wait for symbols loading
  await screen.findAllByText(/EURUSD description/);

  // Assert
  expect(screen.getByLabelText('Login')).toBeDisabled();
  expect(screen.getByLabelText('Login')).toHaveValue(login);
  expect(screen.queryByRole('button', { name: 'Upload' })).not.toBeInTheDocument();
});

it('Render NewOrderModal for archived account', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  const apolloMockResponseData = {
    account: {
      _id: 'UUID',
      uuid: 'UUID',
      name: 'My USD account',
      group: 'USD_GROUP',
      accountType: 'LIVE',
      credit: 4.11,
      balance: 100.53,
      login: 100,
      currency: 'USD',
      leverage: 100,
      enable: false,
    },
  };

  // Act
  render(<NewOrderModal {...props} />, apolloMockResponseData);

  fireEvent.change(screen.getByLabelText('Login'), { target: { value: 'UUID' } });
  fireEvent.click(screen.getByRole('button', { name: 'Upload' }));

  // Wait for symbols loading
  await screen.findAllByText(/EURUSD description/);

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Sell at ${bid.toFixed(5)}`);

  // Assert
  expect(screen.getByText('This account is archived')).toBeInTheDocument();
  expect(screen.getByLabelText('Login')).toBeEnabled();
  expect(screen.getByRole('button', { name: 'Upload' })).toBeEnabled();
  expect(screen.getByLabelText('Volume')).toBeDisabled();
  expect(screen.getByLabelText('Symbol')).toBeDisabled();
  expect(screen.getByLabelText('Take profit')).toBeDisabled();
  expect(screen.getByLabelText('Stop Loss')).toBeDisabled();
  expect(screen.getByLabelText('Open price')).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Update' })).toBeDisabled();
  expect(screen.getByLabelText(/Auto/)).toBeDisabled();
  expect(screen.getByLabelText(/Pending order/)).toBeDisabled();
  expect(screen.getByLabelText(/Sell P&L/)).toBeDisabled();
  expect(screen.getByLabelText(/Buy P&L/)).toBeDisabled();
  expect(screen.getByLabelText(/Sell required margin/)).toBeDisabled();
  expect(screen.getByLabelText(/Buy required margin/)).toBeDisabled();
  expect(screen.getByLabelText('Comment')).toBeDisabled();
  expect(screen.getByText(`Sell at ${bid.toFixed(5)}`)).toBeDisabled();
  expect(screen.getByText(`Buy at ${ask.toFixed(5)}`)).toBeDisabled();
});
