import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation LeadsUploadModal_uploadLeadsMutation(
    $file: Upload!,
  ) {
    upload {
      leadCsvUpload (
        file: $file,
      ) {
        success
        error {
          error
        }
      }
    }
  }
`;

const uploadLeadsMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

uploadLeadsMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default uploadLeadsMutation;
