import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query FilterSetsQuery(
    $type: FilterSet__Types__Enum!
  ) {
    filterSets(
      type: $type
    ) {
      favourite {
        name
        uuid
        favourite
      }
      common {
        name
        uuid
        favourite
      }
    }
  }
`;

const FilterSetsQuery = ({ children, filterSetType }) => (
  <Query
    query={REQUEST}
    variables={{ type: filterSetType }}
    fetchPolicy="network-only"
  >
    {children}
  </Query>
);

FilterSetsQuery.propTypes = {
  children: PropTypes.func.isRequired,
  filterSetType: PropTypes.string.isRequired,
};

export default FilterSetsQuery;
