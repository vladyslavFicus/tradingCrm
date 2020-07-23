import React from 'react';
import PropTypes from 'constants/propTypes';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query UserAcquisitionQuery($uuid: String!) {
  userHierarchyAcquisitionById(uuid: $uuid) {
    acquisitionStatus
    retentionRepresentative
    retentionStatus
    retentionOperator {
      fullName
      hierarchy {
        parentBranches {
          name
          branchType
          parentBranch {
            name
            branchType
          }
        }
      }
    }
    salesRepresentative
    salesStatus
    salesOperator {
      fullName
      hierarchy {
        parentBranches {
          name
          branchType
          parentBranch {
            name
            branchType
          }
        }
      }
    }
  }
}`;

const UserAcquisitionQuery = ({ children, match: { params: { id } } }) => (
  <Query
    query={REQUEST}
    variables={{ uuid: id }}
  >
    {children}
  </Query>
);

UserAcquisitionQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default UserAcquisitionQuery;
