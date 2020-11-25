import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const MUTATION = gql`
  mutation EmailSend(
    $uuid: String!
    $field: String!
    $type: String!
    $name: String
    $subject: String!
    $text: String!
  ) {
    emailTemplates {
      sendEmail(
        uuid: $uuid
        field: $field
        type: $type
        templateName: $name
        subject: $subject
        text: $text
      )
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
