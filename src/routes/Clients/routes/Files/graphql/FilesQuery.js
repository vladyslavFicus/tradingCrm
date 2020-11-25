import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query FilesGrid__FilesQuery(
    $size: Int
    $page: Int
    $searchBy: String
    $uploadedDateFrom: String
    $uploadedDateTo: String
    $verificationType: String
    $documentType: String
  ){
    files(
      size: $size
      page: $page
      searchBy: $searchBy
      uploadedDateFrom: $uploadedDateFrom
      uploadedDateTo: $uploadedDateTo
      verificationType: $verificationType
      documentType: $documentType
    ) {
      last
      number
      page
      totalElements
      totalPages
      content {
        clientUuid
        client {
          fullName
        }
        fileName
        title
        documentType
        status
        uploadBy
        uuid
        verificationType
        type
        uploadDate
        expirationDate
      }
    }
  }
`;

const FilesQuery = ({ children, location: { state } }) => (
  <Query
    query={REQUEST}
    variables={{
      ...state && state.filters,
      page: 0,
      size: 20,
    }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

FilesQuery.propTypes = {
  children: PropTypes.func.isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      filters: PropTypes.object,
    }),
  }).isRequired,
};

export default FilesQuery;
