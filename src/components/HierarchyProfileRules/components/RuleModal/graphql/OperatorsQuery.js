import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query RuleModal_OperatorsQuery(
  $status: String
  $page: Page__Input
) {
  operators(
    page: $page
    status: $status
  ) {
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
    fetchPolicy="cache-and-network"
    variables={{
      status: 'ACTIVE',
      page: {
        sorts: [
          { column: 'firstName', direction: 'ASC' },
          { column: 'lastName', direction: 'ASC' },
        ],
      },
    }}
  >
    {children}
  </Query>
);

OperatorsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default OperatorsQuery;
