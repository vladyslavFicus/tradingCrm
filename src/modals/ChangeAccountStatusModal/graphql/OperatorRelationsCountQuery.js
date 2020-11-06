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

const OperatorRelationsCountQuery = ({ children, uuid, withSubordinatesWarnings }) => (
  <Query query={REQUEST} variables={{ uuid }} skip={!withSubordinatesWarnings}>
    {children}
  </Query>
);

OperatorRelationsCountQuery.propTypes = {
  children: PropTypes.func.isRequired,
  uuid: PropTypes.string.isRequired,
  withSubordinatesWarnings: PropTypes.bool.isRequired,
};

export default OperatorRelationsCountQuery;
