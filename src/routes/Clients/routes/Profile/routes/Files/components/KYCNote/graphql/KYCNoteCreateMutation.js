import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
import { REQUEST as query } from './KYCNoteQuery';

const REQUEST = gql`
  mutation KYCNoteCreate(
    $content: String!
    $targetUUID: String!
    $playerUUID: String!
    $targetType: String!
  ) {
    note {
      add(
        content: $content
        targetUUID: $targetUUID
        playerUUID: $playerUUID
        targetType: $targetType
      ) {
        _id
      }
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
