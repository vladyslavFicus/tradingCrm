import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
import { NoteFragment } from 'graphql/fragments/notes';

const MUTATION = gql`mutation updateNote(
  $subject: String
  $content: String!
  $targetUUID: String!
  $pinned: Boolean!
  $noteId: String!
) {
  note {
    update(
      noteId: $noteId
      targetUUID: $targetUUID
      subject: $subject
      content: $content
      pinned: $pinned
    ) {
      ...NoteFragment
    }
  }
}
${NoteFragment}`;

const UpdateNoteMutation = ({ children }) => (
  <Mutation mutation={MUTATION}>
    {children}
  </Mutation>
);

UpdateNoteMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateNoteMutation;
