import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { NoteFragment } from 'apollo/fragments/notes';
import Calendar from 'components/Calendar';

const REQUEST = gql`
  query CallbacksCalendarQuery(
    $callbackTimeFrom: String
    $callbackTimeTo: String
    $limit: Int
  ) {
    callbacks(
      callbackTimeFrom: $callbackTimeFrom
      callbackTimeTo: $callbackTimeTo
      limit: $limit
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

const CallbacksCalendarQuery = ({ children }) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
    variables={{
      callbackTimeFrom: Calendar.firstVisibleDate(),
      callbackTimeTo: Calendar.lastVisibleDate(),
      limit: 2000,
    }}
  >
    {children}
  </Query>
);

CallbacksCalendarQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default CallbacksCalendarQuery;
