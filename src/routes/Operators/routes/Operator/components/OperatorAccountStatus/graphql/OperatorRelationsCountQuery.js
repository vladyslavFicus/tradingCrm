import React from 'react';
import { Query } from '@apollo/client/react/components';
import { gql } from '@apollo/client';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`
  query OperatorAccountStatus_OperatorRelationsCountQuery($uuid: String!) {
    operatorRelationsCount(uuid: $uuid) {
      customersCount
      leadsCount
      rulesCount
    }
  }
`;

const OperatorRelationsCountQuery = ({ children, operator }) => (
  <Query
    query={REQUEST}
    variables={{ uuid: operator.uuid }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

OperatorRelationsCountQuery.propTypes = {
  children: PropTypes.func.isRequired,
  operator: PropTypes.operator.isRequired,
};

export default OperatorRelationsCountQuery;
