import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

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
