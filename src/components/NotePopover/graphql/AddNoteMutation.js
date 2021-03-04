import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { NoteFragment } from 'apollo/fragments/notes';
import { ENTITIES } from './constants';

const addToApolloCache = targetUUID => (cache, { data: { note: { add: data } } }) => {
  if (data) {
    cache.writeFragment({
      fragment: NoteFragment,
      data,
    });

    ENTITIES.forEach((entity) => {
      const item = cache.data.get(`${entity}:${targetUUID}`);

      if (item) {
        cache.data.set(`${entity}:${targetUUID}`, {
          ...item,
          note: {
            generated: false,
            id: `${data.__typename}:${data.noteId}`,
            type: 'id',
            typename: data.__typename,
          },
        });
      }
    });
  }
};

const MUTATION = gql`mutation AddNoteMutation(
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

const AddNoteMutation = ({ children, targetUUID }) => (
  <Mutation
    mutation={MUTATION}
    update={addToApolloCache(targetUUID)}
  >
    {children}
  </Mutation>
);

AddNoteMutation.propTypes = {
  children: PropTypes.func.isRequired,
  targetUUID: PropTypes.string,
};

AddNoteMutation.defaultProps = {
  targetUUID: null,
};

export default AddNoteMutation;
