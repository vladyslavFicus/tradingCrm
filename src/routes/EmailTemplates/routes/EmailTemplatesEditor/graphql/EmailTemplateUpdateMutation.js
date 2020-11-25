import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

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
