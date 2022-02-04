import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query DesksGridFilter_getOfficesQuery {
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
