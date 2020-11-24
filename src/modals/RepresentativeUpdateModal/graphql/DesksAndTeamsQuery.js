import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query RepresentativeUpdateModal_DesksAndTeamsQuery {
    userBranches {
      DESK {
        name
        uuid
        deskType
        parentBranch {
          uuid
        }
      }
      TEAM {
        name
        uuid
        parentBranch {
          uuid
          deskType
        }
      }
    }
  }
`;

const DesksAndTeamsQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="cache-and-network">
    {children}
  </Query>
);

DesksAndTeamsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default DesksAndTeamsQuery;
