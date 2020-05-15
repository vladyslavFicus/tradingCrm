import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query DesksGridFilter_getOfficesQuery {
    hierarchy {
      userBranchHierarchy {
        data {
          OFFICE {
            name
            uuid
            branchType
            defaultUser
            defaultBranch
            country
            brandId
            parentBranch {
              uuid
            }
          }
        }
      }
    }
  }
`;

const getOfficesQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="network-only">
    {children}
  </Query>
);

getOfficesQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default getOfficesQuery;
