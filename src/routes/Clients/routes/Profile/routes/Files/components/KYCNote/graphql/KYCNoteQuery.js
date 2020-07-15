import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'constants/propTypes';
import { Query } from 'react-apollo';

export const REQUEST = gql`
  query KYCNote_KYCNoteQuery($playerUUID: String!) {
    profile(playerUUID: $playerUUID) {
      _id
      kycNote {
        noteId
        content
        targetUUID
        playerUUID
      }
      kyc {
        uuid
      }
    }
  }
`;

const KYCNoteQuery = ({ playerUUID, children }) => (
  <Query query={REQUEST} fetchPolicy="cache-and-network" variables={{ playerUUID }}>
    {children}
  </Query>
);

KYCNoteQuery.propTypes = {
  children: PropTypes.func.isRequired,
  playerUUID: PropTypes.string.isRequired,
};

export default KYCNoteQuery;
