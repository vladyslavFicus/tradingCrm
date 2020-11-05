import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query OperatorRelationsCountQuery($uuid: String!) {
  operatorRelationsCount(uuid: $uuid) {
    customersCount
    leadsCount
    rulesCount
  }
}`;

const OperatorRelationsCountQuery = ({ children, uuid }) => (
  <Query query={REQUEST} variables={{ uuid }}>
    {children}
  </Query>
);

OperatorRelationsCountQuery.propTypes = {
  children: PropTypes.func.isRequired,
  uuid: PropTypes.string.isRequired,
};

export default OperatorRelationsCountQuery;
