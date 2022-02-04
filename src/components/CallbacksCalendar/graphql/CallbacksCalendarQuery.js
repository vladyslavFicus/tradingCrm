import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
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
    ) @connection(key: $connectionKey) {
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

const CallbacksCalendarQuery = ({ children, connectionKey }) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
    variables={{
      callbackTimeFrom: Calendar.firstVisibleDate(),
      callbackTimeTo: Calendar.lastVisibleDate(),
      limit: 2000,
      connectionKey, // Need to create different lists in cache when render 2 or more calendars on same page
    }}
  >
    {children}
  </Query>
);

CallbacksCalendarQuery.propTypes = {
  children: PropTypes.func.isRequired,
  connectionKey: PropTypes.string,
};

CallbacksCalendarQuery.defaultProps = {
  connectionKey: null,
};

export default CallbacksCalendarQuery;
