import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation UploadFile(
    $file: Upload!
    $uuid: String!
  ) {
    file {
      upload(
        file: $file
        uuid: $uuid
      ) {
        fileUuid
      }
    }
  }
`;

const UploadFile = ({ children }) => (
  <Mutation mutation={REQUEST}>{children}</Mutation>
);

UploadFile.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UploadFile;
