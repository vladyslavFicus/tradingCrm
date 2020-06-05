import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query FeedTypesQuery_FeedFilterForm($playerUUID: String!) {
    feedTypes (playerUUID: $playerUUID) {
      error {
        error
        fields_errors
      }
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
    }
}`;

const FeedTypesQuery = ({ children, match: { params: { id: playerUUID } } }) => (
  <Query query={REQUEST} variables={{ playerUUID }}>
    {children}
  </Query>
);

FeedTypesQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.object.isRequired,
  }).isRequired,
};

export default FeedTypesQuery;
