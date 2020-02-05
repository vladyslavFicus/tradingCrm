import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const MUTATION = gql`
  mutation EmailTemplateUpdate($name: String!, $subject: String!, $text: String!, $id: ID!) {
    emailTemplates {
      updateEmailTemplate(name: $name, subject: $subject, text: $text, id: $id) {
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

const EmailTemplateUpdateMutation = ({ children }) => (
  <Mutation mutation={MUTATION}>
    {children}
  </Mutation>
);

EmailTemplateUpdateMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default EmailTemplateUpdateMutation;
