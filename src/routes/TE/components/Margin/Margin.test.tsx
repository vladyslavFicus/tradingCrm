import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  TradingEngine__SymbolTypes__Enum as SymbolTypes,
} from '__generated__/types';
import Margin from './Margin';

// Mock Margin Debug child component
jest.mock('./MarginDebug', () => () => null);

it('Render Margin with missing symbolType prop', () => {
  // Arrange
  const props = {
    openPrice: 10.12311,
    lotSize: 100000,
    percentage: 100,
    volume: 0.01,
    leverage: 100,
    marginRate: 0.91154122,
    loaderSize: 20,
  };

  // Act
  render(<Margin {...props} />);

  // Assert
  expect(screen.getByTestId('CircleLoader')).toBeInTheDocument();
  expect(screen.queryByTestId('Margin')).not.toBeInTheDocument();
});

it('Render Margin with missing openPrice prop', () => {
  // Arrange
  const props = {
    symbolType: SymbolTypes.FOREX,
    lotSize: 100000,
    percentage: 100,
    volume: 0.01,
    leverage: 100,
    marginRate: 0.91154122,
    loaderSize: 20,
  };

  // Act
  render(<Margin {...props} />);

  // Assert
  expect(screen.getByTestId('CircleLoader')).toBeInTheDocument();
  expect(screen.queryByTestId('Margin')).not.toBeInTheDocument();
});

it('Render Margin with missing leverage prop', () => {
  // Arrange
  const props = {
    symbolType: SymbolTypes.FOREX,
    openPrice: 10.12311,
    lotSize: 100000,
    percentage: 100,
    volume: 0.01,
    marginRate: 0.91154122,
    loaderSize: 20,
  };

  // Act
  render(<Margin {...props} />);

  // Assert
  expect(screen.getByTestId('CircleLoader')).toBeInTheDocument();
  expect(screen.queryByTestId('Margin')).not.toBeInTheDocument();
});

it('Render Margin with missing percentage prop', () => {
  // Arrange
  const props = {
    symbolType: SymbolTypes.FOREX,
    openPrice: 10.12311,
    lotSize: 100000,
    volume: 0.01,
    leverage: 100,
    marginRate: 0.91154122,
    loaderSize: 20,
  };

  // Act
  render(<Margin {...props} />);

  // Assert
  expect(screen.getByTestId('CircleLoader')).toBeInTheDocument();
  expect(screen.queryByTestId('Margin')).not.toBeInTheDocument();
});

it('Render Margin with missing marginRate prop', () => {
  // Arrange
  const props = {
    symbolType: SymbolTypes.FOREX,
    openPrice: 10.12311,
    lotSize: 100000,
    percentage: 100,
    volume: 0.01,
    leverage: 100,
    loaderSize: 20,
  };

  // Act
  render(<Margin {...props} />);

  // Assert
  expect(screen.getByTestId('CircleLoader')).toBeInTheDocument();
  expect(screen.queryByTestId('Margin')).not.toBeInTheDocument();
});

it('Render Margin with FOREX symbolType', () => {
  // Arrange
  const props = {
    symbolType: SymbolTypes.FOREX,
    openPrice: 10.12311,
    lotSize: 100000,
    percentage: 100,
    volume: 0.01,
    leverage: 100,
    marginRate: 0.91154122,
    loaderSize: 20,
  };

  // Act
  render(<Margin {...props} />);

  // Assert
  expect(screen.getByTestId('Margin')).toHaveTextContent('9.12');
});

it('Render Margin with CFD symbolType', () => {
  // Arrange
  const props = {
    symbolType: SymbolTypes.CFD,
    openPrice: 10.12311,
    lotSize: 100000,
    percentage: 100,
    volume: 0.01,
    leverage: 100,
    marginRate: 0.91154122,
    loaderSize: 20,
  };

  // Act
  render(<Margin {...props} />);

  // Assert
  expect(screen.getByTestId('Margin')).toHaveTextContent('9227.63');
});
