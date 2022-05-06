import React from 'react';
import { render as testingLibraryRender, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import permissions from 'config/permissions';
import StorageProvider from 'providers/StorageProvider';
import { MockedPermissionProvider } from 'providers/PermissionsProvider';
import CoreLayout from 'layouts/CoreLayout';
import { MockedRSocketProvider } from 'rsocket';
import { AccountQueryDocument } from './graphql/__generated__/AccountQuery';
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
}];

// Custom renderer
const render = (
  component: React.ReactElement,
  apolloMockData = {},
  _permissions: string[] = [],
) => testingLibraryRender(
  <BrowserRouter>
    <StorageProvider>
      <MockedProvider mocks={apolloMockFactory(apolloMockData)} addTypename={false}>
        <MockedRSocketProvider>
          <MockedPermissionProvider permissions={_permissions}>
            <CoreLayout>
              {component}
            </CoreLayout>
          </MockedPermissionProvider>
        </MockedRSocketProvider>
      </MockedProvider>
    </StorageProvider>
  </BrowserRouter>,
);

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

  // Wait for account loading
  await screen.findByText(/My USD account/);

  // Assert
  expect(screen.getByLabelText('Login')).toBeDisabled();
  expect(screen.getByLabelText('Login')).toHaveValue(login);
  expect(screen.queryByRole('button', { name: 'Upload' })).not.toBeInTheDocument();
});

it('Render NewOrderModal with create order permission', async () => {
  // Act
  render(<NewOrderModal {...props} />, {}, [
    permissions.WE_TRADING.CREATE_ORDER,
  ]);

  // Assert
  expect(screen.getByLabelText('Login')).toBeEnabled();
  expect(screen.getByRole('button', { name: 'Upload' })).toBeInTheDocument();
  expect(screen.queryByTestId('generalNewOrder')).not.toBeInTheDocument();
  expect(screen.queryByTestId('smartPnlNewOrder')).not.toBeInTheDocument();
});

it('Render NewOrderModal with create closed order permission', async () => {
  // Act
  render(<NewOrderModal {...props} />, {}, [
    permissions.WE_TRADING.CREATE_CLOSED_ORDER,
  ]);

  // Assert
  expect(screen.getByLabelText('Login')).toBeEnabled();
  expect(screen.getByRole('button', { name: 'Upload' })).toBeInTheDocument();
  expect(screen.queryByTestId('generalNewOrder')).not.toBeInTheDocument();
  expect(screen.queryByTestId('smartPnlNewOrder')).not.toBeInTheDocument();
});

it('Render NewOrderModal with create order and create closed order permission', async () => {
  // Act
  render(<NewOrderModal {...props} />, {}, [
    permissions.WE_TRADING.CREATE_ORDER,
    permissions.WE_TRADING.CREATE_CLOSED_ORDER,
  ]);

  // Assert
  expect(screen.getByLabelText('Login')).toBeEnabled();
  expect(screen.getByRole('button', { name: 'Upload' })).toBeInTheDocument();
  expect(screen.getByTestId('generalNewOrder')).toBeInTheDocument();
  expect(screen.getByTestId('smartPnlNewOrder')).toBeInTheDocument();
});
