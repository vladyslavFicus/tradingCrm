import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { userTypes } from 'constants/hierarchyTypes';

const REQUEST = gql`
  query HierarchyUsersByTypeQuery(
    $userTypes: [String]!
    $onlyActive: Boolean
  ) {
    usersByType(
      userTypes: $userTypes
      onlyActive: $onlyActive
    ) {
      SALES_AGENT {
        uuid
        userType
        fullName
        operatorStatus
      }
      SALES_HOD {
        uuid
        userType
        fullName
        operatorStatus
      }
      SALES_MANAGER {
        uuid
        userType
        fullName
        operatorStatus
      }
      SALES_LEAD {
        uuid
        userType
        fullName
        operatorStatus
      }
      RETENTION_AGENT {
        uuid
        userType
        fullName
        operatorStatus
      }
      RETENTION_HOD {
        uuid
        userType
        fullName
        operatorStatus
      }
      RETENTION_MANAGER {
        uuid
        userType
        fullName
        operatorStatus
      }
      RETENTION_LEAD {
        uuid
        userType
        fullName
        operatorStatus
      }
    }
  }
`;

const HierarchyUsersByTypeQuery = ({ children }) => (
  <Query
    query={REQUEST}
    variables={{
      userTypes: [
        userTypes.SALES_AGENT,
        userTypes.SALES_HOD,
        userTypes.SALES_MANAGER,
        userTypes.SALES_LEAD,
        userTypes.RETENTION_HOD,
        userTypes.RETENTION_MANAGER,
        userTypes.RETENTION_LEAD,
        userTypes.RETENTION_AGENT,
      ],
      onlyActive: true,
    }}
    fetchPolicy="network-only"
  >
    {children}
  </Query>
);

HierarchyUsersByTypeQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default HierarchyUsersByTypeQuery;
