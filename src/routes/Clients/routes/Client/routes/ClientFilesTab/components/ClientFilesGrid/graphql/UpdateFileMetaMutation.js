import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`mutation ClientFilesTab_UpdateFileMetaMutation(
  $uuid: String!
  $title: String
  $verificationType: String
  $documentType: String
  $status: String
) {
  file {
    updateFileMeta(
      uuid: $uuid,
      title: $title,
      verificationType: $verificationType,
      documentType: $documentType,
      status: $status
    )
  }
}
`;

const UpdateFileMetaMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>{children}</Mutation>
);

UpdateFileMetaMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateFileMetaMutation;
