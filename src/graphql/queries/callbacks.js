import gql from 'graphql-tag';
import { NoteFragment } from '../fragments/notes';

const callbacksQuery = gql`query getCallbacks(
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
${NoteFragment}`;

export {
  callbacksQuery,
};
