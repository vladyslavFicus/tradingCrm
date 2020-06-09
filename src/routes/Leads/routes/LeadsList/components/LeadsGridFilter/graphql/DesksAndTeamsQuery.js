import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query LeadsGridFilter_DesksAndTeamsQuery {
  hierarchy {
    userBranchHierarchy {
      data {
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
      error {
        error
      }
    }
  }
}`;

const DesksAndTeamsQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="network-only">{children}</Query>
);

DesksAndTeamsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default DesksAndTeamsQuery;
