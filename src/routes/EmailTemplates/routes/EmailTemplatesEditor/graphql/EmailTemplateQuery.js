import React from 'react';
import { gql } from '@apollo/client';
import PropTypes from 'constants/propTypes';
import { Query } from '@apollo/client/react/components';

export const query = gql`
  query EmailTemplatesEditor_getEmailTemplate(
    $id: ID!
  ) {
    emailTemplate(
      id: $id
    ) {
      id
      name
      text
      subject
    }
  }
`;

const EmailTemplateQuery = ({ match: { params: { id } }, children }) => (
  <Query query={query} fetchPolicy="no-cache" variables={{ id }}>
    {children}
  </Query>
);

EmailTemplateQuery.propTypes = {
  children: PropTypes.func.isRequired,
  ...PropTypes.router,
};

export default EmailTemplateQuery;
