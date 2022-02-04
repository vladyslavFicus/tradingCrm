import React from 'react';
import { Query } from '@apollo/client/react/components';
import { gql } from '@apollo/client';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`
  query ClientTradingAccountsTab_ClientTradingAccountsQuery(
  $profileUUID: String!
  $accountType: String
  $platformType: String
) {
  clientTradingAccounts(
    profileUUID: $profileUUID,
    accountType: $accountType
    platformType: $platformType
  ) {
    accountUUID
    currency
    balance
    credit
    margin
    name
    login
    group
    accountType
    platformType
    archived
    leverage
    readOnlyUpdateTime
    readOnlyUpdatedBy
    readOnly
    profileUUID
    operator {
      fullName
    }
    lastLeverageChangeRequest {
      changeLeverageFrom
      changeLeverageTo
      status
      createDate
    }
  }
}
`;

const TradingAccountsQuery = ({
  children,
  match: {
    params: { id: profileUUID },
  },
  location: { state },
}) => (
  <Query
    query={REQUEST}
    variables={{
      profileUUID,
      accountType: 'LIVE',
      ...state && state.filters,
    }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

TradingAccountsQuery.propTypes = {
  ...PropTypes.router,
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default TradingAccountsQuery;
