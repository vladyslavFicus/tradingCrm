import { OrderType } from 'types/trading-engine';
import { calculatePnL } from './pnl';

it('Calculate PnL without necessary arguments', () => {
  // Arrange
  const type = OrderType.BUY;

  // Act
  const pnl = calculatePnL({ type });

  // Assert
  expect(pnl).toBe(0);
});

it('Calculate PnL with openPrice', () => {
  // Arrange
  const type = OrderType.BUY;
  const openPrice = 10.12311;

  // Act
  const pnl = calculatePnL({ type, openPrice });

  // Assert
  expect(pnl).toBe(0);
});

it('Calculate PnL with openPrice, currentPriceBid', () => {
  // Arrange
  const type = OrderType.BUY;
  const openPrice = 10.12311;
  const currentPriceBid = 11.02311;

  // Act
  const pnl = calculatePnL({ type, openPrice, currentPriceBid });

  // Assert
  expect(pnl).toBe(0);
});

it('Calculate PnL with openPrice, currentPriceBid, currentPriceAsk', () => {
  // Arrange
  const type = OrderType.BUY;
  const openPrice = 10.12311;
  const currentPriceBid = 11.02311;
  const currentPriceAsk = 11.12311;

  // Act
  const pnl = calculatePnL({ type, openPrice, currentPriceBid, currentPriceAsk });

  // Assert
  expect(pnl).toBe(0);
});

it('Calculate PnL with openPrice, currentPriceBid, currentPriceAsk, lotSize', () => {
  // Arrange
  const type = OrderType.BUY;
  const openPrice = 10.12311;
  const currentPriceBid = 11.02311;
  const currentPriceAsk = 11.12311;
  const lotSize = 10000;

  // Act
  const pnl = calculatePnL({ type, openPrice, currentPriceBid, currentPriceAsk, lotSize });

  // Assert
  expect(pnl).toBe(0);
});

it('Calculate PnL with openPrice, currentPriceBid, currentPriceAsk, lotSize, volume', () => {
  // Arrange
  const type = OrderType.BUY;
  const openPrice = 10.12311;
  const currentPriceBid = 11.02311;
  const currentPriceAsk = 11.12311;
  const lotSize = 10000;
  const volume = 1.5;

  // Act
  const pnl = calculatePnL({ type, openPrice, currentPriceBid, currentPriceAsk, lotSize, volume });

  // Assert
  expect(pnl).toBe(0);
});

it('Calculate PnL with all necessary arguments for type === BUY', () => {
  // Arrange
  const type = OrderType.BUY;
  const openPrice = 10.12311;
  const currentPriceBid = 11.02311;
  const currentPriceAsk = 11.12311;
  const lotSize = 10000;
  const volume = 1.5;
  const exchangeRate = 1.24953993493;

  // Act
  const pnl = calculatePnL({ type, openPrice, currentPriceBid, currentPriceAsk, lotSize, volume, exchangeRate });

  // Assert
  expect(pnl).toBe(16868.79);
});

it('Calculate PnL with all necessary arguments for type === SELL', () => {
  // Arrange
  const type = OrderType.SELL;
  const openPrice = 10.12311;
  const currentPriceBid = 11.02311;
  const currentPriceAsk = 11.12311;
  const lotSize = 10000;
  const volume = 1.5;
  const exchangeRate = 1.24953993493;

  // Act
  const pnl = calculatePnL({ type, openPrice, currentPriceBid, currentPriceAsk, lotSize, volume, exchangeRate });

  // Assert
  expect(pnl).toBe(-18743.1);
});

it('Calculate PnL with all necessary arguments for type === SELL_STOP', () => {
  // Arrange
  const type = OrderType.SELL_STOP;
  const openPrice = 10.12311;
  const currentPriceBid = 11.02311;
  const currentPriceAsk = 11.12311;
  const lotSize = 10000;
  const volume = 1.5;
  const exchangeRate = 1.24953993493;

  // Act
  const pnl = calculatePnL({ type, openPrice, currentPriceBid, currentPriceAsk, lotSize, volume, exchangeRate });

  // Assert
  expect(pnl).toBe(0);
});

it('Calculate PnL with all necessary arguments for type === SELL_LIMIT', () => {
  // Arrange
  const type = OrderType.SELL_LIMIT;
  const openPrice = 10.12311;
  const currentPriceBid = 11.02311;
  const currentPriceAsk = 11.12311;
  const lotSize = 10000;
  const volume = 1.5;
  const exchangeRate = 1.24953993493;

  // Act
  const pnl = calculatePnL({ type, openPrice, currentPriceBid, currentPriceAsk, lotSize, volume, exchangeRate });

  // Assert
  expect(pnl).toBe(0);
});

it('Calculate PnL with all necessary arguments for type === BUY_STOP', () => {
  // Arrange
  const type = OrderType.BUY_STOP;
  const openPrice = 10.12311;
  const currentPriceBid = 11.02311;
  const currentPriceAsk = 11.12311;
  const lotSize = 10000;
  const volume = 1.5;
  const exchangeRate = 1.24953993493;

  // Act
  const pnl = calculatePnL({ type, openPrice, currentPriceBid, currentPriceAsk, lotSize, volume, exchangeRate });

  // Assert
  expect(pnl).toBe(0);
});

it('Calculate PnL with all necessary arguments for type === BUY_LIMIT', () => {
  // Arrange
  const type = OrderType.BUY_STOP;
  const openPrice = 10.12311;
  const currentPriceBid = 11.02311;
  const currentPriceAsk = 11.12311;
  const lotSize = 10000;
  const volume = 1.5;
  const exchangeRate = 1.24953993493;

  // Act
  const pnl = calculatePnL({ type, openPrice, currentPriceBid, currentPriceAsk, lotSize, volume, exchangeRate });

  // Assert
  expect(pnl).toBe(0);
});
