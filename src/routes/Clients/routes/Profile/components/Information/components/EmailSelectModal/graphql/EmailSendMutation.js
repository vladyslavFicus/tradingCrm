import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const MUTATION = gql`
  mutation EmailSend($name: String, $subject: String!, $text: String!, $email: String!) {
    emailTemplates {
      sendEmail(templateName: $name, subject: $subject, text: $text, toEmail: $email) {
        data {
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

const EmailSendMutation = ({ children }) => (
  <Mutation mutation={MUTATION}>
    {children}
  </Mutation>
);

EmailSendMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default EmailSendMutation;
