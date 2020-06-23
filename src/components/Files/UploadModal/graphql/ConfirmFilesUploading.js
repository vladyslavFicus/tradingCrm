import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation ConfirmFilesUploading(
    $documents: [FileToUpload]!
    $profileUuid: String!
  ) {
    file {
      confirmFilesUploading(
        documents: $documents
        profileUuid: $profileUuid
      )
    }
  }
`;

const ConfirmFilesUploading = ({ children }) => (
  <Mutation mutation={REQUEST}>{children}</Mutation>
);

ConfirmFilesUploading.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ConfirmFilesUploading;
