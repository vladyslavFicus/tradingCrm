import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation ConfirmUploadedFiles(
    $documents: [InputFileType]!
    $profileUuid: String!
  ) {
    file {
      confirmFiles(documents: $documents, profileUuid: $profileUuid) {
        data {
          success
        }
      }
    }
  }
`;

const ConfirmUploadedFiles = ({ children }) => (
  <Mutation mutation={REQUEST}>{children}</Mutation>
);

ConfirmUploadedFiles.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ConfirmUploadedFiles;
