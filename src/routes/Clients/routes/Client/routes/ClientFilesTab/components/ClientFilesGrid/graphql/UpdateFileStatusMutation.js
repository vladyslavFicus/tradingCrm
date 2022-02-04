import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`mutation ClientFilesTab_UpdateFileStatusMutation(
  $uuid: String!
  $verificationType: String
  $documentType: String
  $verificationStatus: String
) {
  file {
    updateFileStatus(
      uuid: $uuid,
      verificationType: $verificationType,
      documentType: $documentType,
      verificationStatus: $verificationStatus
    )
  }
}`;

const UpdateFileStatusMutation = ({ children, match: { params: { id } } }) => (
  <Mutation mutation={REQUEST} variables={{ uuid: id }}>{children}</Mutation>
);

UpdateFileStatusMutation.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default UpdateFileStatusMutation;
