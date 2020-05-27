import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation AddNote(
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
        data {
          _id
          noteId
          targetUUID
          playerUUID
          subject
          content
          pinned
          changedAt
          changedBy
          operator {
            fullName
          }
        }
        error {
          error
        }
      }
    }
  }
`;

const AddNote = ({ children }) => (
  <Mutation mutation={REQUEST}>{children}</Mutation>
);

AddNote.propTypes = {
  children: PropTypes.func.isRequired,
};

export default AddNote;
