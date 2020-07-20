import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query PartnerFeedsFiltersForm_getFeedsTypesQuery(
    $uuid: String!
  ) {
    feedTypes (
      uuid: $uuid
    )
  }
`;

const FeedsTypesQuery = ({
  children,
  match: { params: { id } },
}) => (
  <Query query={REQUEST} variables={{ uuid: id }}>
    {children}
  </Query>
);

FeedsTypesQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default FeedsTypesQuery;