import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { NoteFragment } from 'graphql/fragments/notes';

const REQUEST = gql`
  query CallbackDetailsModal_getCallback(
    $id: String!,
  ) {
    callback(
      id: $id,
    ) {
      data {
        _id
        operatorId
        userId
        callbackId
        callbackTime
        status
        creationTime
        updateTime
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
      error {
        error
        fields_errors
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
