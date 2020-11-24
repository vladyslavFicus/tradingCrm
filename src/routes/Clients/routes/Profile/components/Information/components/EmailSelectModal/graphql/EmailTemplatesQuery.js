import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

export const REQUEST = gql`
  query getEmailTemplates {
    emailTemplates {
      id
      name
      text
      subject
    }
  }
`;

const EmailTemplatesQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="cache-and-network">
    {children}
  </Query>
);

EmailTemplatesQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default EmailTemplatesQuery;
