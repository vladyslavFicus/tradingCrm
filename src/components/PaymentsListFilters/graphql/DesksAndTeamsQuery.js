import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query PaymentListFilters_DesksAndTeamsQuery {
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
}`;

const DesksAndTeamsQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="cache-and-network">
    {children}
  </Query>
);

DesksAndTeamsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default DesksAndTeamsQuery;
