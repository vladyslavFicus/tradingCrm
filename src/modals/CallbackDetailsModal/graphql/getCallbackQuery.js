import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import { NoteFragment } from 'graphql/fragments/notes';

const REQUEST = gql`
  query CallbackDetailsModal_getCallback(
    $id: String!,
  ) {
    callback(
      id: $id,
    ) {
      _id
      operatorId
      userId
      callbackId
      callbackTime
      status
      creationTime
      updateTime
      reminder
      operator {
        fullName
      }
      client {
        fullName
      }
      note {
        ...NoteFragment,
      }
    }
  }
  ${NoteFragment}
`;

const getCallbackQuery = ({ children, callbackId }) => (
  <Query query={REQUEST} variables={{ id: callbackId }} fetchPolicy="network-only">
    {children}
  </Query>
);

getCallbackQuery.propTypes = {
  children: PropTypes.func.isRequired,
  callbackId: PropTypes.string.isRequired,
};

export default getCallbackQuery;
