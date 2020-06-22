import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query PartnerFeedsFiltersForm_getFeedsTypesQuery(
    $id: String!
  ) {
    feedTypes (
      playerUUID: $id
    ) {
      data {
        PLAYER_PROFILE_CHANGED
        RESET_PASSWORD
        LOG_IN
        CHANGE_PASSWORD
        PLAYER_PROFILE_REGISTERED
        LOG_OUT
        FAILED_LOGIN_ATTEMPT
        PROFILE_ASSIGN
        CHANGE_LEVERAGE_REQUESTED
      }
      error {
        error
      }
    }
  }
`;

const getFeedsTypesQuery = ({
  children,
  match: { params: { id } },
}) => (
  <Query query={REQUEST} variables={{ id }}>
    {children}
  </Query>
);

getFeedsTypesQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default getFeedsTypesQuery;
