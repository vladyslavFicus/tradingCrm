import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`query OperatorsGridFilter_OfficesDesksAndTeamsQuery {
  userBranches {
    OFFICE {
      name
      uuid
    }
    DESK {
      name
      uuid
      parentBranch {
        uuid
      }
    }
    TEAM {
      name
      uuid
      parentBranch {
        uuid
      }
    }
  }
}
`;

const OfficesDesksAndTeamsQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="cache-and-network">
    {children}
  </Query>
);

OfficesDesksAndTeamsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default OfficesDesksAndTeamsQuery;
