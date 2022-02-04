import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const MUTATION = gql`
  mutation EmailTemplateCreate(
    $name: String!
    $subject: String!
    $text: String!
  ) {
    emailTemplates {
      createEmailTemplate(
        name: $name
        subject: $subject
        text: $text
      )
    }
  }
`;

const EmailTemplateCreateMutation = ({ children }) => (
  <Mutation mutation={MUTATION}>
    {children}
  </Mutation>
);

EmailTemplateCreateMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default EmailTemplateCreateMutation;
