import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { userTypes } from 'constants/hierarchyTypes';

const REQUEST = gql`
  query RepresentativeUpdateModal_OperatorsByTypeQuery(
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
        operator {
          fullName
          hierarchy {
            parentBranches {
              branchType
              uuid
            }
          }
        }
      }
      SALES_HOD {
        uuid
        userType
        fullName
        operator {
          fullName
          hierarchy {
            parentBranches {
              branchType
              uuid
            }
          }
        }
      }
      SALES_MANAGER {
        uuid
        userType
        fullName
        operator {
          fullName
          hierarchy {
            parentBranches {
              branchType
              uuid
            }
          }
        }
      }
      SALES_LEAD {
        uuid
        userType
        fullName
        operator {
          fullName
          hierarchy {
            parentBranches {
              branchType
              uuid
            }
          }
        }
      }
      RETENTION_AGENT {
        uuid
        userType
        fullName
        operator {
          fullName
          hierarchy {
            parentBranches {
              branchType
              uuid
            }
          }
        }
      }
      RETENTION_HOD {
        uuid
        userType
        fullName
        operator {
          fullName
          hierarchy {
            parentBranches {
              branchType
              uuid
            }
          }
        }
      }
      RETENTION_MANAGER {
        uuid
        userType
        fullName
        operator {
          fullName
          hierarchy {
            parentBranches {
              branchType
              uuid
            }
          }
        }
      }
      RETENTION_LEAD {
        uuid
        userType
        fullName
        operator {
          fullName
          hierarchy {
            parentBranches {
              branchType
              uuid
            }
          }
        }
      }
    }
  }
`;

const OperatorsByTypeQuery = ({ children }) => (
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
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

OperatorsByTypeQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default OperatorsByTypeQuery;
