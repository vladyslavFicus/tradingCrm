import React from 'react';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import PropTypes from 'constants/propTypes';

export const REQUEST = gql`query FilesCategoriesQuery {
  filesCategories {
    DOCUMENT_VERIFICATION
    ADDRESS_VERIFICATION
    OTHER
  }
}
`;

const FilesCategoriesQuery = ({ children }) => (
  <Query query={REQUEST}>
    {children}
  </Query>
);

FilesCategoriesQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default FilesCategoriesQuery;
