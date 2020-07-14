import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query FeedTypesQuery_FeedFilterForm(
    $uuid: String!
  ) {
    feedTypes (
      uuid: $uuid
    )
}`;

const FeedTypesQuery = ({ children, match: { params: { id } } }) => (
  <Query query={REQUEST} variables={{ uuid: id }}>
    {children}
  </Query>
);

FeedTypesQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.object.isRequired,
  }).isRequired,
};

export default FeedTypesQuery;
