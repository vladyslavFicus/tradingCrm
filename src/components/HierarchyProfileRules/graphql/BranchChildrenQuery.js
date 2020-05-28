import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { branchTypes } from 'constants/hierarchyTypes';

const REQUEST = gql`query BranchChildrenQuery(
  $uuid: String!,
) {
  hierarchy {
    branchChildren (
      uuid: $uuid,
    ) {
      error {
        error
        fields_errors
      }
      data {
        uuid
        name
        branchType
        country
        defaultUser
        parentBranch {
          uuid
        }
        deskType
        language
        defaultBranch
      }
    }
  }
}`;

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
  branchType: PropTypes.string.isRequired,
};

export default BranchChildrenQuery;
