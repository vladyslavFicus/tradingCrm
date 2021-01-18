import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

const REQUEST = gql`query TradingActivityGridFilter_OperatorsQuery(
  $page: Page__Input
) {
  operators(page: $page) {
    content {
      uuid
      fullName
      operatorStatus
      hierarchy {
        uuid
        userType
      }
    }
  }
}`;

const OperatorsQuery = ({ children }) => (
  <Query
    query={REQUEST}
    variables={{
      page: {
        sorts: [
          { column: 'operatorStatus', direction: 'ASC' },
          { column: 'firstName', direction: 'ASC' },
          { column: 'lastName', direction: 'ASC' },
        ],
      },
    }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

OperatorsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default OperatorsQuery;