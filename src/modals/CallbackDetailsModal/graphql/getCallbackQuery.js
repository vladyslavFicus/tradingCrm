import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { NoteFragment } from 'apollo/fragments/notes';

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
