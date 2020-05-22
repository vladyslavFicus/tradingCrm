import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query OperatorFeeds_getFeedTypes($playerUUID: String!) {
  feedTypes (playerUUID: $playerUUID) {
    error {
      error
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

const FeedTypesQuery = ({ children, playerUUID }) => (
  <Query query={REQUEST} variables={{ playerUUID }}>
    {children}
  </Query>
);

FeedTypesQuery.propTypes = {
  children: PropTypes.func.isRequired,
  playerUUID: PropTypes.string.isRequired,
};

export default FeedTypesQuery;
