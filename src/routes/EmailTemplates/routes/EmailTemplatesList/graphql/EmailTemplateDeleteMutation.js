import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

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
