import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
import { ENTITIES } from './constants';

const removeFromApolloCache = targetUUID => (cache, { data: { note: { remove: data } } }) => {
  if (data) {
    ENTITIES.forEach((entity) => {
      const item = cache.data.get(`${entity}:${targetUUID}`);

      if (item) {
        cache.data.set(`${entity}:${targetUUID}`, {
          ...item,
          note: null,
        });

        cache.data.delete(`${data.__typename}:${data.noteId}`);
      }
    });
  }
};

const MUTATION = gql`mutation removeNote(
  $noteId: String!,
) {
  note {
    remove(noteId: $noteId) {
      noteId
    }
  }
}`;

const RemoveNoteMutation = ({ children, targetUUID }) => (
  <Mutation mutation={MUTATION} update={removeFromApolloCache(targetUUID)}>
    {children}
  </Mutation>
);

RemoveNoteMutation.propTypes = {
  children: PropTypes.func.isRequired,
  targetUUID: PropTypes.string,
};

RemoveNoteMutation.defaultProps = {
  targetUUID: null,
};

export default RemoveNoteMutation;
