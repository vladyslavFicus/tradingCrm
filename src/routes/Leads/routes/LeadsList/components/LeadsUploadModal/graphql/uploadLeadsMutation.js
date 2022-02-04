import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation LeadsUploadModal_uploadLeadsMutation(
    $file: Upload!
  ) {
    leads {
      uploadLeads (
        file: $file
      ) {
       failedLeads {
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
        failedLeadsCount
        createdLeadsCount  
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
