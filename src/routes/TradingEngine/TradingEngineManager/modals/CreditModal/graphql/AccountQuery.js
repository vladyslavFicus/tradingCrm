import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query TradingEngine_AccountQuery($identifier: String!) {
    tradingEngineAccount (
      identifier: $identifier
    ) {
      _id
      uuid
      name
      login
      group
      credit
      enable
      margin
      profileUuid
      profileFullName
      registrationDate
      leverage
      balance
      accountType
    }
  }
`;

const AccountQuery = ({ children, match: { params: { id } } }) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
    variables={{ identifier: id }}
  >
    {children}
  </Query>
);

AccountQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default AccountQuery;
