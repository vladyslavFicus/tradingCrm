import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query getPlayerMiniProfile($playerUUID: String!) {
    newProfile(playerUUID: $playerUUID) {
      data {
        _id
        age
        profileView {
          balance {
            amount
          }
          lastSignInSessions {
            startedAt
          }
          paymentDetails {
            lastDepositTime
          }
        }
        firstName
        lastName
        uuid
        languageCode
        status {
          reason
          type
        }
        registrationDetails {
          registrationDate
        }
        kyc {
          status
        }
      }
      error {
        error
        fields_errors
      }
    }
  }
`;

const PlayerMiniProfileQuery = ({ playerUUID, children }) => (
  <Query query={REQUEST} variables={{ playerUUID }} fetchPolicy="cache-and-network">
    {children}
  </Query>
);

PlayerMiniProfileQuery.propTypes = {
  children: PropTypes.func.isRequired,
  playerUUID: PropTypes.string.isRequired,
};

export default PlayerMiniProfileQuery;