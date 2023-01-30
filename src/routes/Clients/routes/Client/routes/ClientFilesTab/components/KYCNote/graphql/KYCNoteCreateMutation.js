import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
import { REQUEST as query } from './KYCNoteQuery';

const REQUEST = gql`
  mutation KYCNoteCreate(
    $playerUUID: String!
    $content: String!
    $targetUUID: String!
    $targetType: String!
    $pinned: Boolean!
  ) {
    note {
      add(
        playerUUID: $playerUUID
        content: $content
        targetUUID: $targetUUID
        targetType: $targetType
        pinned: $pinned
      )
    }
  }
`;

const KYCNoteCreateMutation = ({ playerUUID, children }) => (
  <Mutation
    mutation={REQUEST}
    refetchQueries={[{
      query,
      variables: { playerUUID },
    }]}
  >
    {children}
  </Mutation>
);

KYCNoteCreateMutation.propTypes = {
  children: PropTypes.func.isRequired,
  playerUUID: PropTypes.string.isRequired,
};

export default KYCNoteCreateMutation;
