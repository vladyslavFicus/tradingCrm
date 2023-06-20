import React from 'react';
import { render as testingLibraryRender, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MockedApolloProvider from 'apollo/MockedApolloProvider';
import StorageProvider from 'providers/StorageProvider';
import CoreLayout from 'layouts/CoreLayout';
import { MockedRSocketProvider } from 'rsocket';
import { round } from 'utils/round';
import { AccountQueryDocument } from './graphql/__generated__/AccountQuery';
import { AccountSymbolsQueryDocument } from './graphql/__generated__/AccountSymbolsQuery';
import SmartPnLForm from './SmartPnLForm';

const accountUuid = 'UUID';

// Define mocks for Apollo
const apolloMockFactory = (data = {}) => [{
  request: {
    query: AccountQueryDocument,
    variables: { identifier: accountUuid },
  },
  result: {
    data: {
      tradingEngine: {
        __typename: 'TradingEngineQuery',
        account: {
          uuid: accountUuid,
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
    variables: { accountUuid },
  },
  result: {
    data: {
      tradingEngine: {
        __typename: 'TradingEngineQuery',
        accountSymbols: [{
          name: 'EURUSD',
          description: 'EURUSD description',
          digits: 5,
          symbolType: 'FOREX',
          securityName: 'Forex',
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
      <MockedApolloProvider mocks={apolloMockFactory(apolloMockData)}>
        <MockedRSocketProvider>
          <CoreLayout>
            {component}
          </CoreLayout>
        </MockedRSocketProvider>
      </MockedApolloProvider>
    </StorageProvider>
  </BrowserRouter>,
);


it('Render SmartPnLForm and wait for symbols and ticks from rsocket', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;
  const receivedPnl = 1;
  const sellClosePrice = 1.1448;
  const buyClosePrice = 1.1652;

  // Act
  render(<SmartPnLForm accountUuid={accountUuid} />);

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
  expect(screen.getByLabelText('Expected P/L')).toHaveValue(receivedPnl);
  expect(screen.getByLabelText('Expected P/L')).toBeEnabled();
  expect(screen.getByLabelText('Sell open price')).toHaveValue(bid);
  expect(screen.getByLabelText('Sell open price')).toBeDisabled();
  expect(screen.getByLabelText('Buy open price')).toHaveValue(ask);
  expect(screen.getByLabelText('Buy open price')).toBeDisabled();
  expect(screen.getByLabelText('Sell close price')).toHaveValue(sellClosePrice);
  expect(screen.getByLabelText('Sell close price')).toBeDisabled();
  expect(screen.getByLabelText('Buy close price')).toHaveValue(buyClosePrice);
  expect(screen.getByLabelText('Buy close price')).toBeDisabled();
});

it('Render SmartPnLForm and click on "Sell Auto" checkbox', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;
  const sellClosePrice = 1.1448;

  // Act
  render(<SmartPnLForm accountUuid={accountUuid} />);

  // Wait for symbols loading
  await screen.findAllByText(/EURUSD description/);

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Sell at ${bid.toFixed(5)}`);

  // Assert
  expect(screen.getByTestId('SmartPnLForm-sellAutoOpenPriceButton')).toBeChecked();
  expect(screen.getByLabelText(/Sell open price/)).toBeDisabled();

  await act(async () => {
    fireEvent.click(screen.getByTestId('SmartPnLForm-sellAutoOpenPriceButton'));
  });

  expect(screen.getByTestId('SmartPnLForm-sellAutoOpenPriceButton')).not.toBeChecked();
  expect(screen.getByLabelText(/Sell open price/)).toBeEnabled();
  expect(screen.getByLabelText('Sell close price')).toHaveValue(sellClosePrice);
  expect(screen.getByLabelText('Sell close price')).toBeDisabled();
});

it('Render SmartPnLForm and click on "Sell Auto" checkbox and "Update" button', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  const newAsk = 1.111;
  const newBid = 1.777;

  const sellClosePrice = 1.1448;
  const newSellClosePrice = 1.767;

  // Act
  render(<SmartPnLForm accountUuid={accountUuid} />);

  // Wait for symbols loading
  await screen.findAllByText(/EURUSD description/);

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Sell at ${bid.toFixed(5)}`);

  await act(async () => {
    fireEvent.click(screen.getByTestId('SmartPnLForm-sellAutoOpenPriceButton'));
  });

  // Assert
  expect(screen.getByLabelText('Sell open price')).toHaveValue(bid);
  expect(screen.getByLabelText('Sell open price')).toBeEnabled();
  expect(screen.getByLabelText('Sell close price')).toHaveValue(sellClosePrice);
  expect(screen.getByLabelText('Sell close price')).toBeDisabled();

  // Publish tick message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask: newAsk, bid: newBid }));

  await act(async () => {
    // We should wait 500 ms (update interval in SymbolPricesStream) to notify component about changes
    await new Promise(res => setTimeout(res, 500));
  });

  fireEvent.click(screen.getByTestId('SmartPnLForm-sellPriceUpdateButton'));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Sell at ${newBid.toFixed(5)}`);

  // Assert
  expect(screen.getByLabelText('Sell open price')).toHaveValue(newBid);
  expect(screen.getByLabelText('Sell open price')).toBeEnabled();
  expect(screen.getByLabelText('Sell close price')).toHaveValue(newSellClosePrice);
  expect(screen.getByLabelText('Sell close price')).toBeDisabled();
  expect(screen.getByText(`Sell at ${newBid.toFixed(5)}`)).toBeEnabled();
});

it('Render SmartPnLForm and click on "Buy Auto" checkbox', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;
  const buyClosePrice = 1.1652;

  // Act
  render(<SmartPnLForm accountUuid={accountUuid} />);

  // Wait for symbols loading
  await screen.findAllByText(/EURUSD description/);

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Sell at ${bid.toFixed(5)}`);

  // Assert
  expect(screen.getByTestId('SmartPnLForm-buyAutoOpenPriceButton')).toBeChecked();
  expect(screen.getByLabelText(/Buy open price/)).toBeDisabled();

  await act(async () => {
    fireEvent.click(screen.getByTestId('SmartPnLForm-buyAutoOpenPriceButton'));
  });

  expect(screen.getByTestId('SmartPnLForm-buyAutoOpenPriceButton')).not.toBeChecked();
  expect(screen.getByLabelText(/Buy open price/)).toBeEnabled();
  expect(screen.getByLabelText('Buy close price')).toHaveValue(buyClosePrice);
  expect(screen.getByLabelText('Buy close price')).toBeDisabled();
});

it('Render SmartPnLForm and click on "Buy Auto" checkbox and "Update" button', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  const newAsk = 1.111;
  const newBid = 1.777;

  const buyClosePrice = 1.1652;
  const newBuyClosePrice = 1.121;

  // Act
  render(<SmartPnLForm accountUuid={accountUuid} />);

  // Wait for symbols loading
  await screen.findAllByText(/EURUSD description/);

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Sell at ${bid.toFixed(5)}`);

  await act(async () => {
    fireEvent.click(screen.getByTestId('SmartPnLForm-buyAutoOpenPriceButton'));
  });

  // Assert
  expect(screen.getByLabelText('Buy open price')).toHaveValue(ask);
  expect(screen.getByLabelText('Buy open price')).toBeEnabled();
  expect(screen.getByLabelText('Buy close price')).toHaveValue(buyClosePrice);
  expect(screen.getByLabelText('Buy close price')).toBeDisabled();

  // Publish tick message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask: newAsk, bid: newBid }));

  await act(async () => {
    // We should wait 500 ms (update interval in SymbolPricesStream) to notify component about changes
    await new Promise(res => setTimeout(res, 500));
  });

  fireEvent.click(screen.getByTestId('SmartPnLForm-buyPriceUpdateButton'));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Sell at ${newBid.toFixed(5)}`);

  // Assert
  expect(screen.getByLabelText('Buy open price')).toHaveValue(newAsk);
  expect(screen.getByLabelText('Buy open price')).toBeEnabled();
  expect(screen.getByLabelText('Buy close price')).toHaveValue(newBuyClosePrice);
  expect(screen.getByLabelText('Buy close price')).toBeDisabled();
  expect(screen.getByText(`Buy at ${newAsk.toFixed(5)}`)).toBeEnabled();
});

it('Render SmartPnLForm and applying group spread for chosen symbol', async () => {
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
      securityName: 'Forex',
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
  render(<SmartPnLForm accountUuid={accountUuid} />, apolloMockResponseData);

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
  expect(screen.getByLabelText('Sell open price')).toHaveValue(sellPrice);
  expect(screen.getByLabelText('Buy open price')).toHaveValue(buyPrice);
});

it('Render SmartPnLForm and configure volumeLots field', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  const sellClosePrice = 1.1448;
  const buyClosePrice = 1.1652;

  // Act
  render(<SmartPnLForm accountUuid={accountUuid} />);

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
  expect(screen.getByLabelText('Sell close price')).toHaveValue(sellClosePrice);
  expect(screen.getByLabelText('Sell close price')).toBeDisabled();
  expect(screen.getByLabelText('Buy close price')).toHaveValue(buyClosePrice);
  expect(screen.getByLabelText('Buy close price')).toBeDisabled();
  expect(screen.getByText(`Sell at ${bid.toFixed(5)}`)).toBeEnabled();
  expect(screen.getByText(`Buy at ${ask.toFixed(5)}`)).toBeEnabled();

  fireEvent.change(screen.getByLabelText('Volume'), { target: { value: 0.001 } });
  await screen.findAllByText(/The Volume must be at least 0.01./);
  expect(screen.getByText(`Sell at ${bid.toFixed(5)}`).closest('button')).toBeDisabled();
  expect(screen.getByText(`Buy at ${ask.toFixed(5)}`).closest('button')).toBeDisabled();
  expect(screen.getByLabelText('Sell close price')).toHaveValue(1.0548);
  expect(screen.getByLabelText('Sell close price')).toBeDisabled();
  expect(screen.getByLabelText('Buy close price')).toHaveValue(1.2552);
  expect(screen.getByLabelText('Buy close price')).toBeDisabled();

  fireEvent.change(screen.getByLabelText('Volume'), { target: { value: 10001 } });
  await screen.findAllByText(/The Volume may not be greater than 100./);
  expect(screen.getByText(`Sell at ${bid.toFixed(5)}`).closest('button')).toBeDisabled();
  expect(screen.getByText(`Buy at ${ask.toFixed(5)}`).closest('button')).toBeDisabled();
  expect(screen.getByLabelText('Sell close price')).toHaveValue(1.1548);
  expect(screen.getByLabelText('Sell close price')).toBeDisabled();
  expect(screen.getByLabelText('Buy close price')).toHaveValue(1.1552);
  expect(screen.getByLabelText('Buy close price')).toBeDisabled();

  fireEvent.change(screen.getByLabelText('Volume'), { target: { value: 0.012 } });
  await screen.findAllByText(/The Volume must be changed with step 0.01/);
  expect(screen.getByText(`Sell at ${bid.toFixed(5)}`).closest('button')).toBeDisabled();
  expect(screen.getByText(`Buy at ${ask.toFixed(5)}`).closest('button')).toBeDisabled();
  expect(screen.getByLabelText('Sell close price')).toHaveValue(1.14647);
  expect(screen.getByLabelText('Sell close price')).toBeDisabled();
  expect(screen.getByLabelText('Buy close price')).toHaveValue(1.16353);
  expect(screen.getByLabelText('Buy close price')).toBeDisabled();
});

it('Render SmartPnLForm and configure fields to get negative close price', async () => {
  // Arrange
  const ask = 1.1552;
  const bid = 1.1548;

  // Act
  render(<SmartPnLForm accountUuid={accountUuid} />);

  // Wait for symbols loading
  await screen.findAllByText(/EURUSD description/);

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Sell at ${bid.toFixed(5)}`);

  expect(screen.getByLabelText('Sell close price')).toHaveValue(1.1448);
  expect(screen.getByLabelText('Sell close price')).toBeDisabled();
  expect(screen.getByLabelText('Buy close price')).toHaveValue(1.1652);
  expect(screen.getByLabelText('Buy close price')).toBeDisabled();
  expect(screen.queryByText('The price can not be negative')).not.toBeInTheDocument();
  expect(screen.getByText(`Sell at ${bid.toFixed(5)}`)).toBeEnabled();
  expect(screen.getByText(`Buy at ${ask.toFixed(5)}`)).toBeEnabled();

  // Change SELL price to get negative sell close price
  await act(async () => {
    fireEvent.click(screen.getByTestId('SmartPnLForm-sellAutoOpenPriceButton'));
    fireEvent.change(screen.getByLabelText('Sell open price'), { target: { value: -1.05725 } });
  });

  await screen.findAllByText(/The price can not be negative/);
  expect(screen.getByText(`Sell at ${(-1.05725).toFixed(5)}`).closest('button')).toBeDisabled();
  expect(screen.getByText(`Buy at ${ask.toFixed(5)}`).closest('button')).toBeEnabled();
  expect(screen.getByLabelText('Sell close price')).toHaveValue(-1.06725);
  expect(screen.getByLabelText('Sell close price')).toBeDisabled();
  expect(screen.getByLabelText('Buy close price')).toHaveValue(1.1652);
  expect(screen.getByLabelText('Buy close price')).toBeDisabled();
  expect(screen.getAllByText(/The price can not be negative/).length).toEqual(1);

  // Change BUY price to get negative sell close price
  await act(async () => {
    fireEvent.click(screen.getByTestId('SmartPnLForm-buyAutoOpenPriceButton'));
    fireEvent.change(screen.getByLabelText('Buy open price'), { target: { value: -1.03725 } });
  });

  await screen.findAllByText(/The price can not be negative/);
  expect(screen.getByText(`Sell at ${(-1.05725).toFixed(5)}`).closest('button')).toBeDisabled();
  expect(screen.getByText(`Buy at ${(-1.03725).toFixed(5)}`).closest('button')).toBeDisabled();
  expect(screen.getByLabelText('Sell close price')).toHaveValue(-1.06725);
  expect(screen.getByLabelText('Sell close price')).toBeDisabled();
  expect(screen.getByLabelText('Buy close price')).toHaveValue(-1.02725);
  expect(screen.getByLabelText('Buy close price')).toBeDisabled();
  expect(screen.getAllByText(/The price can not be negative/).length).toEqual(2);
});

it('Render SmartPnLForm for archived account', async () => {
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
  render(<SmartPnLForm accountUuid={accountUuid} />, apolloMockResponseData);

  // Wait for symbols loading
  await screen.findAllByText(/EURUSD description/);

  // Publish message to rsocket
  MockedRSocketProvider.publish(rsocketMockFactory({ ask, bid }));

  // Wait while rsocket tick will be accepted by component
  await screen.findByText(`Sell at ${bid.toFixed(5)}`);

  // Assert
  expect(screen.getByLabelText('Expected P/L')).toBeDisabled();
  expect(screen.getByLabelText('Volume')).toBeDisabled();
  expect(screen.getByLabelText('Open time')).toBeDisabled();
  expect(screen.getByLabelText('Symbol')).toBeDisabled();
  expect(screen.getByLabelText('Sell open price')).toBeDisabled();
  expect(screen.getByTestId('SmartPnLForm-sellPriceUpdateButton')).toBeDisabled();
  expect(screen.getByTestId('SmartPnLForm-sellAutoOpenPriceButton')).toBeDisabled();
  expect(screen.getByLabelText('Sell close price')).toBeDisabled();
  expect(screen.getByLabelText('Buy open price')).toBeDisabled();
  expect(screen.getByTestId('SmartPnLForm-buyPriceUpdateButton')).toBeDisabled();
  expect(screen.getByTestId('SmartPnLForm-buyAutoOpenPriceButton')).toBeDisabled();
  expect(screen.getByLabelText('Buy close price')).toBeDisabled();
  expect(screen.getByLabelText('Commission')).toBeDisabled();
  expect(screen.getByLabelText('Swaps')).toBeDisabled();
  expect(screen.getByLabelText(/Sell required margin/)).toBeDisabled();
  expect(screen.getByLabelText(/Buy required margin/)).toBeDisabled();
  expect(screen.getByText(`Sell at ${bid.toFixed(5)}`).closest('button')).toBeDisabled();
  expect(screen.getByText(`Buy at ${ask.toFixed(5)}`).closest('button')).toBeDisabled();
});
