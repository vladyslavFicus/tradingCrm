import React from 'react';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import { NoteFragment } from 'apollo/fragments/notes';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`query ClientFilesTab_FilesByProfileUuidQuery(
  $size: Int,
  $page: Int,
  $clientUuid: String!,
  $searchBy: String,
  $fileCategory: String,
  $uploadDateFrom: String,
  $uploadDateTo: String,
){
  clientFiles(
    size: $size,
    page: $page,
    clientUuid: $clientUuid,
    searchBy: $searchBy,
    fileCategory: $fileCategory,
    uploadDateFrom: $uploadDateFrom,
    uploadDateTo: $uploadDateTo,
  ) {
    verificationType
    attemptsLeft
    documents {
      documentType
      verificationTime
      verifiedBy
      verificationStatus
      files {
        _id
        clientUuid
        client {
          fullName
        }
        fileName
        title
        documentType
        mediaType
        status
        uploadBy
        uuid
        verificationType
        type
        uploadDate
        expirationDate
        note {
        ...NoteFragment,
        }
      }
    }
  }
}
${NoteFragment}`;

const FilesByProfileUuidQuery = ({
  children,
  location: { query },
  match: { params: { id: clientUuid } },
}) => (
  <Query
    query={REQUEST}
    variables={{
      ...query?.filters,
      clientUuid,
    }}
    fetchPolicy="network-only"
  >
    {children}
  </Query>
);

FilesByProfileUuidQuery.propTypes = {
  ...PropTypes.router,
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default FilesByProfileUuidQuery;
