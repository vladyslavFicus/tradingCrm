import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`query RulesQuery(
  $uuid: [String],
  $country: String,
  $language: String,
  $createdByOrUuid: String,
  $name: String,
  $type: Rule__Type__Enum,
  $parentId: String,
  $branchUuid: String,
) {
  rules (
    uuid: $uuid,
    country: $country,
    language: $language,
    createdByOrUuid: $createdByOrUuid,
    name: $name,
    type: $type,
    parentId: $parentId,
    branchUuid: $branchUuid,
  ) {
    uuid
    countries
    languages
    partners {
      uuid,
      fullName,
    }
    sources
    priority
    name
    type
    updatedBy
    createdBy
  }
}`;

const RulesQuery = ({
  children,
  location: { query },
  match: { params: { id: branchUuid } },
}) => (
  <Query
    query={REQUEST}
    variables={{
      ...query && query.filters,
      branchUuid,
    }}
  >
    {children}
  </Query>
);

RulesQuery.propTypes = {
  ...PropTypes.router,
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default RulesQuery;
