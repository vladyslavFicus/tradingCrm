import { OrderDirection } from 'types/trading-engine';
import { calculateClosePrice } from './closePirce';

it('Calculate close price without necessary arguments', () => {
  // Arrange
  const direction = OrderDirection.BUY;
  const pnl = null;
  const openPrice = null;

  // Act
  const closePrice = calculateClosePrice({
    direction,
    pnl,
    openPrice,
  });

  // Assert
  expect(closePrice).toBe(0);
});

it('Calculate close price with pnl', () => {
  // Arrange
  const direction = OrderDirection.BUY;
  const pnl = 100;
  const openPrice = 0;

  // Act
  const closePrice = calculateClosePrice({
    direction,
    pnl,
    openPrice,
  });

  // Assert
  expect(closePrice).toBe(0);
});

it('Calculate close price with pnl, openPrice', () => {
  // Arrange
  const direction = OrderDirection.BUY;
  const pnl = 100;
  const openPrice = 1.01501;

  // Act
  const closePrice = calculateClosePrice({
    direction,
    pnl,
    openPrice,
  });

  // Assert
  expect(closePrice).toBe(0);
});

it('Calculate close price with pnl, openPrice, lotSize', () => {
  // Arrange
  const direction = OrderDirection.BUY;
  const pnl = 100;
  const openPrice = 1.01501;
  const lotSize = 100000;

  // Act
  const closePrice = calculateClosePrice({
    direction,
    pnl,
    openPrice,
    lotSize,
  });

  // Assert
  expect(closePrice).toBe(0);
});

it('Calculate close price with pnl, openPrice, lotSize, digits', () => {
  // Arrange
  const direction = OrderDirection.BUY;
  const pnl = 100;
  const openPrice = 1.01501;
  const lotSize = 100000;
  const digits = 5;

  // Act
  const closePrice = calculateClosePrice({
    direction,
    pnl,
    openPrice,
    lotSize,
    digits,
  });

  // Assert
  expect(closePrice).toBe(0);
});

it('Calculate close price with pnl, openPrice, lotSize, digits, volume', () => {
  // Arrange
  const direction = OrderDirection.BUY;
  const pnl = 100;
  const openPrice = 1.01501;
  const lotSize = 100000;
  const digits = 5;
  const volume = 1;

  // Act
  const closePrice = calculateClosePrice({
    direction,
    pnl,
    openPrice,
    lotSize,
    digits,
    volume,
  });

  // Assert
  expect(closePrice).toBe(0);
});

it('Calculate close price with with all necessary arguments for direction=BUY', () => {
  // Arrange
  const direction = OrderDirection.BUY;
  const pnl = 100;
  const openPrice = 1.01501;
  const lotSize = 100000;
  const digits = 5;
  const volume = 1;
  const exchangeRate = 1;

  // Act
  const closePrice = calculateClosePrice({
    direction,
    pnl,
    openPrice,
    lotSize,
    digits,
    volume,
    exchangeRate,
  });

  // Assert
  expect(closePrice).toBe(1.01601);
});

it('Calculate close price with with all necessary arguments for direction=SELL', () => {
  // Arrange
  const direction = OrderDirection.SELL;
  const pnl = 100;
  const openPrice = 1.01501;
  const lotSize = 100000;
  const digits = 5;
  const volume = 1;
  const exchangeRate = 1;

  // Act
  const closePrice = calculateClosePrice({
    direction,
    pnl,
    openPrice,
    lotSize,
    digits,
    volume,
    exchangeRate,
  });

  // Assert
  expect(closePrice).toBe(1.01401);
});

it('Calculate close price with with all necessary arguments for PNL=0', () => {
  // Arrange
  const direction = OrderDirection.BUY;
  const pnl = 0;
  const openPrice = 1.01501;
  const lotSize = 100000;
  const digits = 5;
  const volume = 1;
  const exchangeRate = 1;

  // Act
  const closePrice = calculateClosePrice({
    direction,
    pnl,
    openPrice,
    lotSize,
    digits,
    volume,
    exchangeRate,
  });

  // Assert
  expect(closePrice).toBe(openPrice);
});
