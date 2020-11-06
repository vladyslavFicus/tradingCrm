import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { NoteFragment } from 'graphql/fragments/notes';

const REQUEST = gql`
  query CallbacksList_getCallbacks(
    $searchKeyword: String,
    $userId: String,
    $statuses: [Callback__Status__Enum],
    $callbackTimeFrom: String,
    $callbackTimeTo: String,
    $limit: Int,
    $page: Int,
  ) {
    callbacks(
      searchKeyword: $searchKeyword,
      userId: $userId,
      statuses: $statuses,
      callbackTimeFrom: $callbackTimeFrom,
      callbackTimeTo: $callbackTimeTo,
      limit: $limit,
      page: $page,
    ) {
      page
      number
      totalElements
      size
      last
      content {
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
  }
  ${NoteFragment}
`;

const getCallbacksQuery = ({ children, location: { state } }) => (
  <Query
    query={REQUEST}
    variables={{
      ...state?.filters,
      limit: 20,
    }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

getCallbacksQuery.propTypes = {
  children: PropTypes.func.isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      filters: PropTypes.shape({
        searchKeyword: PropTypes.string,
        status: PropTypes.string,
        registrationDateStart: PropTypes.string,
        registrationDateEnd: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default getCallbacksQuery;
