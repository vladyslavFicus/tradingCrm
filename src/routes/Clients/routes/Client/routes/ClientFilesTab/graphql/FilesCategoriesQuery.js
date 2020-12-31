import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query FilesCategoriesQuery {
  filesCategories {
    DOCUMENT_VERIFICATION
    ADDRESS_VERIFICATION
    OTHER
  }
}`;

const FilesCategoriesQuery = ({ children }) => (
  <Query query={REQUEST}>
    {children}
  </Query>
);

FilesCategoriesQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default FilesCategoriesQuery;
