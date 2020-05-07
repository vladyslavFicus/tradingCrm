import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { NoteFragment } from 'graphql/fragments/notes';

const REQUEST = gql`
  mutation CreateCallbackModal_addNoteMutation(
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
          ...NoteFragment
        }
      }
    }
  }
  ${NoteFragment}
`;

const addNoteMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

addNoteMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default addNoteMutation;