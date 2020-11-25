import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'constants/propTypes';
import { Query } from 'react-apollo';

export const REQUEST = gql`query FilesCategoriesQuery {
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
