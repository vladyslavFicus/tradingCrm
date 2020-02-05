import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const MUTATION = gql`
  mutation EmailTemplateCreate($name: String!, $subject: String!, $text: String!) {
    emailTemplates {
      createEmailTemplate(name: $name, subject: $subject, text: $text) {
        data {
          id
          name
          subject
          text
        }
        error {
          error
        }
      }
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
