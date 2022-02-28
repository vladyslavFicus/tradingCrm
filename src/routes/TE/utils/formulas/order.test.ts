import { OrderDirection, OrderTypeOnCreation } from 'types/trading-engine';
import { determineOrderType } from './order';

describe('Order type determination', () => {
  it('Determine order type without necessary arguments and pendingOrder=true', () => {
    // Arrange
    const pendingOrder = true;
    const direction = OrderDirection.BUY;

    // Act
    const type = determineOrderType({ direction, pendingOrder });

    // Assert
    expect(type).toBe(OrderTypeOnCreation.MARKET);
  });

  it('Determine order type without necessary arguments and pendingOrder=false', () => {
    // Arrange
    const pendingOrder = false;
    const direction = OrderDirection.BUY;

    // Act
    const type = determineOrderType({ direction, pendingOrder });

    // Assert
    expect(type).toBe(OrderTypeOnCreation.MARKET);
  });

  it('Determine order type with pendingOrder=true, positive openPrice, direction=BUY', () => {
    // Arrange
    const pendingOrder = true;
    const direction = OrderDirection.BUY;
    const openPrice = 1.11;

    // Act
    const type = determineOrderType({ direction, pendingOrder, openPrice });

    // Assert
    expect(type).toBe(OrderTypeOnCreation.STOP);
  });

  it('Determine order type with negative openPrice, direction=BUY', () => {
    // Arrange
    const pendingOrder = true;
    const direction = OrderDirection.BUY;
    const openPrice = -1.11;

    // Act
    const type = determineOrderType({ direction, pendingOrder, openPrice });

    // Assert
    expect(type).toBe(OrderTypeOnCreation.LIMIT);
  });

  it('Determine order type with positive openPrice, direction=SELL', () => {
    // Arrange
    const pendingOrder = true;
    const direction = OrderDirection.SELL;
    const openPrice = 1.11;

    // Act
    const type = determineOrderType({ direction, pendingOrder, openPrice });

    // Assert
    expect(type).toBe(OrderTypeOnCreation.LIMIT);
  });

  it('Determine order type with negative openPrice, direction=SELL', () => {
    // Arrange
    const pendingOrder = true;
    const direction = OrderDirection.SELL;
    const openPrice = -1.11;

    // Act
    const type = determineOrderType({ direction, pendingOrder, openPrice });

    // Assert
    expect(type).toBe(OrderTypeOnCreation.STOP);
  });

  it('Determine order type with positive openPrice, direction=BUY, currentPrice < openPrice', () => {
    // Arrange
    const pendingOrder = true;
    const direction = OrderDirection.BUY;
    const openPrice = 1.11;
    const currentPrice = 1.10;

    // Act
    const type = determineOrderType({ direction, pendingOrder, openPrice, currentPrice });

    // Assert
    expect(type).toBe(OrderTypeOnCreation.STOP);
  });

  it('Determine order type with negative openPrice, direction=BUY, currentPrice > openPrice', () => {
    // Arrange
    const pendingOrder = true;
    const direction = OrderDirection.BUY;
    const openPrice = -1.11;
    const currentPrice = -1.10;

    // Act
    const type = determineOrderType({ direction, pendingOrder, openPrice, currentPrice });

    // Assert
    expect(type).toBe(OrderTypeOnCreation.LIMIT);
  });

  it('Determine order type with positive openPrice, direction=BUY, currentPrice > openPrice', () => {
    // Arrange
    const pendingOrder = true;
    const direction = OrderDirection.BUY;
    const openPrice = 1.11;
    const currentPrice = 1.12;

    // Act
    const type = determineOrderType({ direction, pendingOrder, openPrice, currentPrice });

    // Assert
    expect(type).toBe(OrderTypeOnCreation.LIMIT);
  });

  it('Determine order type with negative openPrice, direction=BUY, currentPrice < openPrice', () => {
    // Arrange
    const pendingOrder = true;
    const direction = OrderDirection.BUY;
    const openPrice = -1.11;
    const currentPrice = -1.12;

    // Act
    const type = determineOrderType({ direction, pendingOrder, openPrice, currentPrice });

    // Assert
    expect(type).toBe(OrderTypeOnCreation.STOP);
  });

  it('Determine order type with positive openPrice, direction=SELL, currentPrice < openPrice', () => {
    // Arrange
    const pendingOrder = true;
    const direction = OrderDirection.SELL;
    const openPrice = 1.11;
    const currentPrice = 1.10;

    // Act
    const type = determineOrderType({ direction, pendingOrder, openPrice, currentPrice });

    // Assert
    expect(type).toBe(OrderTypeOnCreation.LIMIT);
  });

  it('Determine order type with negative openPrice, direction=SELL, currentPrice > openPrice', () => {
    // Arrange
    const pendingOrder = true;
    const direction = OrderDirection.SELL;
    const openPrice = -1.11;
    const currentPrice = -1.10;

    // Act
    const type = determineOrderType({ direction, pendingOrder, openPrice, currentPrice });

    // Assert
    expect(type).toBe(OrderTypeOnCreation.STOP);
  });

  it('Determine order type with positive openPrice, direction=SELL, currentPrice > openPrice', () => {
    // Arrange
    const pendingOrder = true;
    const direction = OrderDirection.SELL;
    const openPrice = 1.11;
    const currentPrice = 1.12;

    // Act
    const type = determineOrderType({ direction, pendingOrder, openPrice, currentPrice });

    // Assert
    expect(type).toBe(OrderTypeOnCreation.STOP);
  });

  it('Determine order type with negative openPrice, direction=SELL, currentPrice < openPrice', () => {
    // Arrange
    const pendingOrder = true;
    const direction = OrderDirection.SELL;
    const openPrice = -1.11;
    const currentPrice = -1.12;

    // Act
    const type = determineOrderType({ direction, pendingOrder, openPrice, currentPrice });

    // Assert
    expect(type).toBe(OrderTypeOnCreation.LIMIT);
  });

  it('Determine order type with all necessary arguments and pendingOrder=false', () => {
    // Arrange
    const pendingOrder = false;
    const direction = OrderDirection.BUY;
    const openPrice = -1.11;
    const currentPrice = -1.10;

    // Act
    const type = determineOrderType({ direction, pendingOrder, openPrice, currentPrice });

    // Assert
    expect(type).toBe(OrderTypeOnCreation.MARKET);
  });

  it('Determine order type with all necessary arguments and pendingOrder=true, direction=BUY', () => {
    // Arrange
    const pendingOrder = true;
    const direction = OrderDirection.BUY;
    const openPrice = -1.11;
    const currentPrice = -1.10;

    // Act
    const type = determineOrderType({ direction, pendingOrder, openPrice, currentPrice });

    // Assert
    expect(type).toBe(OrderTypeOnCreation.LIMIT);
  });

  it('Determine order type with all necessary arguments and pendingOrder=true, direction=SELL', () => {
    // Arrange
    const pendingOrder = true;
    const direction = OrderDirection.SELL;
    const openPrice = -1.11;
    const currentPrice = -1.12;

    // Act
    const type = determineOrderType({ direction, pendingOrder, openPrice, currentPrice });

    // Assert
    expect(type).toBe(OrderTypeOnCreation.LIMIT);
  });

  it('Determine order type when openPrice === currentPrice  pendingOrder=true, direction=BUY', () => {
    // Arrange
    const pendingOrder = true;
    const direction = OrderDirection.BUY;
    const openPrice = -1.11;
    const currentPrice = -1.11;

    // Act
    const type = determineOrderType({ direction, pendingOrder, openPrice, currentPrice });

    // Assert
    expect(type).toBe(OrderTypeOnCreation.MARKET);
  });

  it('Determine order type when openPrice === currentPrice,  pendingOrder=true, direction=SELL', () => {
    // Arrange
    const pendingOrder = true;
    const direction = OrderDirection.SELL;
    const openPrice = -1.11;
    const currentPrice = -1.11;

    // Act
    const type = determineOrderType({ direction, pendingOrder, openPrice, currentPrice });

    // Assert
    expect(type).toBe(OrderTypeOnCreation.MARKET);
  });
});
