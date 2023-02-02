import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation UploadModal_AddNote(
    $subject: String
    $content: String!
    $targetUUID: String!
    $pinned: Boolean!
    $playerUUID: String!
    $targetType: String!
  ) {
    note {
      add(
        subject: $subject
        content: $content
        targetUUID: $targetUUID
        pinned: $pinned
        playerUUID: $playerUUID
        targetType: $targetType
      )
    }
  }
`;

const AddNote = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

AddNote.propTypes = {
  children: PropTypes.func.isRequired,
};

export default AddNote;