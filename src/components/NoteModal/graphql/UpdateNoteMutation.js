import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { NoteFragment } from 'graphql/fragments/notes';

const REQUEST = gql`
  mutation UpdateNoteMutation(
    $noteId: String!
    $subject: String
    $content: String!
    $pinned: Boolean!
  ) {
    note {
      update(
        noteId: $noteId
        subject: $subject
        content: $content
        pinned: $pinned
      ) {
        data {
          ...NoteFragment
        }
        error {
          error
        }
      }
    }
  }
  ${NoteFragment}
`;

const UpdateNoteMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateNoteMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateNoteMutation;
