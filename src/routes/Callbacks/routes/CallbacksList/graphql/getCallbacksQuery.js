import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { NoteFragment } from 'graphql/fragments/notes';

const REQUEST = gql`
  query CallbacksList_getCallbacks(
    $id: String,
    $userId: String,
    $statuses: [CallbackStatusEnum],
    $callbackTimeFrom: String,
    $callbackTimeTo: String,
    $limit: Int,
    $page: Int,
  ) {
    callbacks(
      id: $id,
      userId: $userId,
      statuses: $statuses,
      callbackTimeFrom: $callbackTimeFrom,
      callbackTimeTo: $callbackTimeTo,
      limit: $limit,
      page: $page,
    ) {
      data {
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
      error {
        error
      }
    }
  }
  ${NoteFragment}
`;

const getCallbacksQuery = ({ children, location: { query = {} } }) => (
  <Query
    query={REQUEST}
    variables={{
      ...query.filters,
      limit: 20,
    }}
    fetchPolicy="network-only"
  >
    {children}
  </Query>
);

getCallbacksQuery.propTypes = {
  children: PropTypes.func.isRequired,
  location: PropTypes.shape({
    query: PropTypes.shape({
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
