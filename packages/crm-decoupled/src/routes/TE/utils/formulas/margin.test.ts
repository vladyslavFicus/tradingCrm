import { TradingEngine__SymbolTypes__Enum as SymbolTypes } from '__generated__/types';
import { calculateMargin } from './margin';

it('Calculate Required Margin without necessary arguments', () => {
  // Act
  const margin = calculateMargin({});

  // Assert
  expect(margin).toBe(0);
});

it('Calculate Required Margin with symbolType', () => {
  // Arrange
  const symbolType = SymbolTypes.FOREX;

  // Act
  const margin = calculateMargin({ symbolType });

  // Assert
  expect(margin).toBe(0);
});

it('Calculate Required Margin with symbolType, openPrice', () => {
  // Arrange
  const symbolType = SymbolTypes.FOREX;
  const openPrice = 10.12311;

  // Act
  const margin = calculateMargin({ symbolType, openPrice });

  // Assert
  expect(margin).toBe(0);
});

it('Calculate Required Margin with symbolType, openPrice, lotSize', () => {
  // Arrange
  const symbolType = SymbolTypes.FOREX;
  const openPrice = 10.12311;
  const lotSize = 100000;

  // Act
  const margin = calculateMargin({ symbolType, openPrice, lotSize });

  // Assert
  expect(margin).toBe(0);
});

it('Calculate Required Margin with symbolType, openPrice, lotSize, percentage', () => {
  // Arrange
  const symbolType = SymbolTypes.FOREX;
  const openPrice = 10.12311;
  const lotSize = 100000;
  const percentage = 100;

  // Act
  const margin = calculateMargin({ symbolType, openPrice, lotSize, percentage });

  // Assert
  expect(margin).toBe(0);
});

it('Calculate Required Margin with symbolType, openPrice, lotSize, percentage, volume', () => {
  // Arrange
  const symbolType = SymbolTypes.FOREX;
  const openPrice = 10.12311;
  const lotSize = 100000;
  const percentage = 100;
  const volume = 0.01;

  // Act
  const margin = calculateMargin({ symbolType, openPrice, lotSize, percentage, volume });

  // Assert
  expect(margin).toBe(0);
});

it('Calculate Required Margin with symbolType, openPrice, lotSize, percentage, volume, leverage', () => {
  // Arrange
  const symbolType = SymbolTypes.FOREX;
  const openPrice = 10.12311;
  const lotSize = 100000;
  const percentage = 100;
  const volume = 0.01;
  const leverage = 100;

  // Act
  const margin = calculateMargin({ symbolType, openPrice, lotSize, percentage, volume, leverage });

  // Assert
  expect(margin).toBe(0);
});

it('Calculate Required Margin with symbolType, openPrice, lotSize, percentage, volume, leverage, marginRate', () => {
  // Arrange
  const symbolType = SymbolTypes.FOREX;
  const openPrice = 10.12311;
  const lotSize = 100000;
  const percentage = 100;
  const volume = 0.01;
  const leverage = 100;
  const marginRate = 0.91154122;

  // Act
  const margin = calculateMargin({ symbolType, openPrice, lotSize, percentage, volume, leverage, marginRate });

  // Assert
  expect(margin).toBe(9.12);
});

it('Calculate Required Margin for symbolType=CFD', () => {
  // Arrange
  const symbolType = SymbolTypes.CFD;
  const openPrice = 39851.52123;
  const lotSize = 1;
  const percentage = 100;
  const volume = 0.01;
  const leverage = 100;
  const marginRate = 0.91154122;

  // Act
  const margin = calculateMargin({ symbolType, openPrice, lotSize, percentage, volume, leverage, marginRate });

  // Assert
  expect(margin).toBe(363.26);
});
