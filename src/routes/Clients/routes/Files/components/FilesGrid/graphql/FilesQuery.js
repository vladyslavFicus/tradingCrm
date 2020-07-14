import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query FilesGrid__FilesQuery(
    $size: Int,
    $page: Int,
    $searchBy: String,
    $uploadedDateFrom: String,
    $uploadedDateTo: String,
    $verificationType: String,
    $documentType: String,
  ){
    files(
      size: $size,
      page: $page,
      searchBy: $searchBy,
      uploadedDateFrom: $uploadedDateFrom,
      uploadedDateTo: $uploadedDateTo,
      verificationType: $verificationType,
      documentType: $documentType,
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

const FilesQuery = ({ children, location: { query } }) => (
  <Query
    query={REQUEST}
    variables={{
      ...query && query.filters,
      page: 0,
      size: 10,
    }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

FilesQuery.propTypes = {
  children: PropTypes.func.isRequired,
  location: PropTypes.shape({
    query: PropTypes.shape({
      filters: PropTypes.object,
    }),
  }).isRequired,
};

export default FilesQuery;
