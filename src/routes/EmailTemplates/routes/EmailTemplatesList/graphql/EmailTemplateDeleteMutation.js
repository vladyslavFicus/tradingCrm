import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const MUTATION = gql`
  mutation EmailTemplateDelete($id: ID!) {
    emailTemplates {
      deleteEmailTemplate(
        id: $id
      )
    }
  }
`;

const EmailTemplateDeleteMutation = ({ children }) => (
  <Mutation mutation={MUTATION}>
    {children}
  </Mutation>
);

EmailTemplateDeleteMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default EmailTemplateDeleteMutation;
