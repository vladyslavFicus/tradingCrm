import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

export const REQUEST = gql`
  query getEmailTemplates {
    emailTemplates {
      data {
        id
        name
        text
        subject  
      }
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
