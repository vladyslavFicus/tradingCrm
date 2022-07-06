import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query OperatorsSubordinatesQuery {
    operatorsSubordinates(hierarchyTypeGroup: "SALES", onlyActive: true) {
      uuid
      fullName
    }
  }
`;

const OperatorsSubordinatesQuery = ({ children }) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

OperatorsSubordinatesQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default OperatorsSubordinatesQuery;
