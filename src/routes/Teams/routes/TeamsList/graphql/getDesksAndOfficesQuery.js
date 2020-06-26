import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query TeamsGridFilter_getDesksAndOfficesQuery {
    userBranches {
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
      DESK {
        name
        uuid
        branchType
        defaultUser
        defaultBranch
        deskType
        language
        brandId
        parentBranch {
          uuid
        }
        isDefault
      }
    }
  }
`;

const getDesksAndOfficesQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="network-only">
    {children}
  </Query>
);

getDesksAndOfficesQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default getDesksAndOfficesQuery;
