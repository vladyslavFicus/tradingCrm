import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query TradingEngine_AccountQuery($accountUuid: String!) {
    tradingEngineAccount (
      accountUuid: $accountUuid
    ) {
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
    variables={{ accountUuid: id }}
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
