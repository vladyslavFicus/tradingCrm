import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import { branchTypes } from 'constants/hierarchyTypes';

const REQUEST = gql`query BranchInfoQuery(
  $branchId: String!,
) {
  branchInfo (
    branchId: $branchId,
  ) {
    defaultUser
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
  branchType: PropTypes.string,
};

BranchInfoQuery.defaultProps = {
  branchType: null,
};

export default BranchInfoQuery;
