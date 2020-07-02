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
      QUESTIONNAIRE_COMPLETED
      OPERATOR_ACCOUNT_CREATED
      TRADING_ACCOUNT_CREATED
      CHANGE_LEVERAGE_REQUEST_CREATED
      CHANGE_LEVERAGE_REQUEST_UPDATED
      PLAYER_PROFILE_VIEWED
      NOTE_PROFILE_CREATED
      RISK_PROFILE_DATA_CREATED
      TRANSFER_IN
      NEW_AFFILIATE_ACCOUNT_CREATED
      NOTE_PROFILE_REMOVED
      INTEREST_RATE
      PLAYER_PROFILE_STATUS_CHANGED
      ATTACHMENT_ADDED
      PLAYER_PROFILE_ACQUISITION_CHANGED
      CREDIT_IN
      PLAYER_PROFILE_TRANSFER_AVAILABILITY_CHANGED
      CREDIT_OUT
      FEE
      INACTIVITY_FEE
      ACCOUNT_CREATED
      WITHDRAW
      PLAYER_PROFILE_KYC_CHANGED
      TRADING_ACCOUNT_READ_ONLY_UPDATED
      TRADING_ACCOUNT_ARCHIVED
      TRADING_ACCOUNT_LEVERAGE_UPDATED
      DEPOSIT
      NOTE_PROFILE_UPDATED
      PLAYER_PROFILE_VERIFIED_EMAIL
      AFFILIATE_ACCOUNT_CREATED
      NEW_OPERATOR_ACCOUNT_CREATED
      TRANSFER_OUT
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
