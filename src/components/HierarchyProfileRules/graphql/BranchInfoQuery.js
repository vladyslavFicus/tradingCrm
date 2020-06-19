import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { branchTypes } from 'constants/hierarchyTypes';

const REQUEST = gql`query BranchInfoQuery(
  $branchId: String!,
) {
  hierarchy {
    branchInfo (
      branchId: $branchId,
    ) {
      data {
        defaultUser
      }
    } 
  }
}`;

const BranchInfoQuery = ({
  children,
  branchType,
  match: { params: { id } },
}) => (
  <Query
    query={REQUEST}
    variables={{ branchId: id }}
    skip={branchType !== branchTypes.TEAM}
  >
    {children}
  </Query>
);

BranchInfoQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  branchType: PropTypes.string.isRequired,
};

export default BranchInfoQuery;
