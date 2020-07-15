import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

export const query = gql`
  query EmailTemplatesList_getEmailTemplates{
    emailTemplates {
      id
      name
      text
      subject
    }
  }
`;

const EmailTemplatesQuery = ({ children }) => (
  <Query query={query} fetchPolicy="cache-and-network">
    {children}
  </Query>
);

EmailTemplatesQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default EmailTemplatesQuery;
