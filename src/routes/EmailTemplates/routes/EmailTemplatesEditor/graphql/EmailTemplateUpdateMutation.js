import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const MUTATION = gql`
  mutation EmailTemplateUpdate(
    $name: String!
    $subject: String!
    $text: String!
    $id: ID!
  ) {
    emailTemplates {
      updateEmailTemplate(
        id: $id
        name: $name
        text: $text
        subject: $subject
      )
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
