import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query TradingEngineAdmin_TradingEngineGroupsQuery {
    tradingEngineGroups {
      groupName
    }
  }
`;

const TradingEngineGroupsQuery = ({ children }) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

TradingEngineGroupsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default TradingEngineGroupsQuery;
