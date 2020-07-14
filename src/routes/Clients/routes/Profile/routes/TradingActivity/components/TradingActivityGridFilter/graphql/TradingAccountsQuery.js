import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query TradingAccountsQuery_TradingActivityGridFilter($profileUUID: String!) {
    clientTradingAccounts(profileUUID: $profileUUID) {
      login
      platformType
    }
  }
`;

const TradingAccountsQuery = ({
  children,
  match: {
    params: { id: profileUUID },
  },
}) => (
  <Query
    query={REQUEST}
    variables={{
      profileUUID,
    }}
  >
    {children}
  </Query>
);

TradingAccountsQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default TradingAccountsQuery;
