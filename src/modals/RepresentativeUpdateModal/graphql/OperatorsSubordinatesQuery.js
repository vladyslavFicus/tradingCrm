import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query RepresentativeUpdateModal_OperatorsSubordinatesQuery(
    $hierarchyTypeGroup: String
    $onlyActive: Boolean
  ) {
    operatorsSubordinates(
      hierarchyTypeGroup: $hierarchyTypeGroup
      onlyActive: $onlyActive
    ) {
      uuid
      fullName
      hierarchy {
        parentBranches {
          branchType
          uuid
        }
      }
    }
  }
`;

const OperatorsSubordinatesQuery = ({ children, type }) => (
  <Query
    query={REQUEST}
    variables={{
      hierarchyTypeGroup: type,
      onlyActive: true,
    }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

OperatorsSubordinatesQuery.propTypes = {
  children: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default OperatorsSubordinatesQuery;
