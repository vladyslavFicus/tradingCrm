import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

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
        data {
          fileUuid
        }
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
