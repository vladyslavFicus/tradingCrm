import React, { Suspense } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { OrderType } from 'types/trading-engine';
import PnL from './PnL';

// Mock PnL Debug child component
jest.mock('./PnLDebug', () => () => null);

it('Render PnL with missing currentPriceBid prop', async () => {
  // Arrange
  const props = {
    type: OrderType.BUY,
    openPrice: 0,
    volume: 1,
    lotSize: 1000,
    currentPriceAsk: 0.0001,
    exchangeRate: 0.8151111,
    loaderSize: 20,
  };

  // Act
  render(
    <Suspense fallback={<div>Loading</div>}>
      <PnL {...props} />
    </Suspense>,
  );

  // Assert
  await waitFor(() => {
    expect(screen.getByTestId('CircleLoader')).toBeInTheDocument();
  });
  expect(screen.queryByTestId('PnL')).not.toBeInTheDocument();
});

it('Render PnL with missing currentPriceAsk prop', () => {
  // Arrange
  const props = {
    type: OrderType.BUY,
    openPrice: 0,
    volume: 1,
    lotSize: 1000,
    currentPriceBid: 0.0001,
    exchangeRate: 0.8151111,
    loaderSize: 20,
  };

  // Act
  render(<PnL {...props} />);

  // Assert
  expect(screen.getByTestId('CircleLoader')).toBeInTheDocument();
  expect(screen.queryByTestId('PnL')).not.toBeInTheDocument();
});

it('Render PnL with missing exchangeRate prop', () => {
  // Arrange
  const props = {
    type: OrderType.BUY,
    openPrice: 0,
    volume: 1,
    lotSize: 1000,
    currentPriceBid: 0.0001,
    currentPriceAsk: 0.0002,
    loaderSize: 20,
  };

  // Act
  render(<PnL {...props} />);

  // Assert
  expect(screen.getByTestId('CircleLoader')).toBeInTheDocument();
  expect(screen.queryByTestId('PnL')).not.toBeInTheDocument();
});

it('Render PnL with missing loaderSize prop', () => {
  // Arrange
  const props = {
    type: OrderType.BUY,
    openPrice: 0,
    volume: 1,
    lotSize: 1000,
    currentPriceBid: 0.0001,
    currentPriceAsk: 0.0002,
    exchangeRate: 0.8151111,
  };

  // Act
  render(<PnL {...props} />);

  // Assert
  expect(screen.queryByTestId('CircleLoader')).not.toBeInTheDocument();
  expect(screen.getByTestId('PnL')).toBeInTheDocument();
});

it('Render PnL with all props', () => {
  // Arrange
  const props = {
    type: OrderType.BUY,
    openPrice: 0,
    volume: 1,
    lotSize: 1000,
    currentPriceBid: 0.0001,
    currentPriceAsk: 0.0002,
    exchangeRate: 0.8151111,
    loaderSize: 20,
  };

  // Act
  render(<PnL {...props} />);

  // Assert
  expect(screen.queryByTestId('CircleLoader')).not.toBeInTheDocument();
  expect(screen.getByTestId('PnL')).toBeInTheDocument();
});

it('Render PnL with positive pnl', () => {
  // Arrange
  const props = {
    type: OrderType.BUY,
    openPrice: 0,
    volume: 1,
    lotSize: 1000,
    currentPriceBid: 0.0001,
    currentPriceAsk: 0.0002,
    exchangeRate: 0.8151111,
    loaderSize: 20,
  };

  // Act
  render(<PnL {...props} />);

  // Assert
  expect(screen.getByTestId('PnL')).toHaveTextContent('0.08');
  expect(screen.getByTestId('PnL')).toHaveClass('PnL--positive');
});

it('Render PnL with negative pnl', () => {
  // Arrange
  const props = {
    type: OrderType.BUY,
    openPrice: 1.1231,
    volume: 1,
    lotSize: 1000,
    currentPriceBid: 0.0001,
    currentPriceAsk: 0.0002,
    exchangeRate: 0.8151111,
    loaderSize: 20,
  };

  // Act
  render(<PnL {...props} />);

  // Assert
  expect(screen.getByTestId('PnL')).toHaveTextContent('-915.37');
  expect(screen.getByTestId('PnL')).toHaveClass('PnL--negative');
});
