import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation LeadsUploadModal_uploadLeadsMutation(
    $file: Upload!
  ) {
    leads {
      uploadLeads (
        file: $file
      ) {
        name
        surname
        phone
        email
        mobile
        country
        source
        salesAgent
        birthDate
        affiliate
        gender
        city
        language
        failureReason
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
