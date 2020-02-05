import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { query } from './EmailTemplatesQuery';

const MUTATION = gql`
  mutation EmailTemplateDelete($id: ID!) {
    emailTemplates {
      deleteEmailTemplate(id: $id) {
        data {
          id
        }
        error {
          error
        }
      }
    }
  }
`;

const EmailTemplateDeleteMutation = ({ children }) => (
  <Mutation
    mutation={MUTATION}
    update={(
      store,
      { data: { emailTemplates: { deleteEmailTemplate: { data, error } } } },
    ) => {
      if (!error) {
        const storedEmailTemplates = store.readQuery({ query });
        storedEmailTemplates.emailTemplates.data = storedEmailTemplates.emailTemplates.data.filter(
          template => template.id !== data.id,
        );

        store.writeQuery({ query, data: storedEmailTemplates });
      }
    }}
  >
    {children}
  </Mutation>
);

EmailTemplateDeleteMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default EmailTemplateDeleteMutation;
