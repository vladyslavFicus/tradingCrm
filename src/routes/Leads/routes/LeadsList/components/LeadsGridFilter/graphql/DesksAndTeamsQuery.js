import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`query LeadsGridFilter_DesksAndTeamsQuery {
  userBranches {
    DESK {
      name
      uuid
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

const DesksAndTeamsQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="network-only">{children}</Query>
);

DesksAndTeamsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default DesksAndTeamsQuery;
