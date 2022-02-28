import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import { branchTypes } from 'constants/hierarchyTypes';

const REQUEST = gql`query BranchChildrenQuery(
  $uuid: String!,
) {
  branchChildren (
    uuid: $uuid,
  ) {
    uuid
  }
}
`;

const BranchChildrenQuery = ({
  children,
  branchType,
  match: { params: { id } },
}) => (
  <Query
    query={REQUEST}
    variables={{ uuid: id }}
    skip={branchType !== branchTypes.DESK}
  >
    {children}
  </Query>
);

BranchChildrenQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  branchType: PropTypes.string,
};

BranchChildrenQuery.defaultProps = {
  branchType: '',
};

export default BranchChildrenQuery;
