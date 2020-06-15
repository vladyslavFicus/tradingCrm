import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { NoteFragment } from 'graphql/fragments/notes';

const REQUEST = gql`
  query ClientsCallbacksTab_getClientCallbacksQuery(
    $id: String,
    $userId: String,
    $statuses: [Callback__StatusEnum],
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
  }
  ${NoteFragment}
`;

const getClientCallbacksQuery = ({
  children,
  location: { query = {} },
  match: { params: { id } },
}) => (
  <Query
    query={REQUEST}
    variables={{
      ...query.filters,
      userId: id,
      limit: 20,
    }}
    fetchPolicy="network-only"
  >
    {children}
  </Query>
);

getClientCallbacksQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  location: PropTypes.shape({
    query: PropTypes.shape({
      filters: PropTypes.object,
    }),
  }).isRequired,
};

export default getClientCallbacksQuery;
