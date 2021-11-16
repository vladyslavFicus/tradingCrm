import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query TradingEngine_FeedFilterForm(
    $uuid: String!
  ) {
    feedTypes (
      uuid: $uuid
    )
}`;

const TradingEngineFeedTypesQuery = ({ children, match: { params: { id } } }) => (
  <Query query={REQUEST} variables={{ uuid: id }}>
    {children}
  </Query>
);

TradingEngineFeedTypesQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.object.isRequired,
  }).isRequired,
};

export default TradingEngineFeedTypesQuery;