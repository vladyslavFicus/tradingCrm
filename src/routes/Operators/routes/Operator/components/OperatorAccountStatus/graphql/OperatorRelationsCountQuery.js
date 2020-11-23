import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
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
  <Query query={REQUEST} variables={{ uuid: operator.uuid }}>
    {children}
  </Query>
);

OperatorRelationsCountQuery.propTypes = {
  children: PropTypes.func.isRequired,
  operator: PropTypes.operator.isRequired,
};

export default OperatorRelationsCountQuery;
