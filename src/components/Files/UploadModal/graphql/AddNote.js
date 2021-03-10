import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { NoteFragment } from 'apollo/fragments/notes';

const REQUEST = gql`mutation UploadModal_AddNote(
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
    ) {
      ...NoteFragment
    }
  }
}
${NoteFragment}`;

const AddNote = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

AddNote.propTypes = {
  children: PropTypes.func.isRequired,
};

export default AddNote;
