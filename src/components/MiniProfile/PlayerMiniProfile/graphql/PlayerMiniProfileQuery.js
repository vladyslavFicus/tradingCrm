import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query getPlayerMiniProfile(
    $playerUUID: String!
  ) {
    profile(
      playerUUID: $playerUUID
    ) {
      _id
      age
      profileView {
        uuid
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
