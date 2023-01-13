import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation ConfirmFilesUploading(
    $documents: [FileUpload__Input]!
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
