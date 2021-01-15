import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { get } from 'lodash';
import { Query } from 'react-apollo';

const REQUEST = gql`query getRules(
  $uuid: [String]
  $country: String
  $language: String
  $createdByOrUuid: String
  $name: String
  $type: Rule__Type__Enum
  $parentId: String
  $operatorUuids: [String]
  $affiliateId: String
) {
  rules (
    uuid: $uuid
    country: $country
    language: $language
    createdByOrUuid: $createdByOrUuid
    name: $name
    type: $type
    parentId: $parentId
    operatorUuids: $operatorUuids
    affiliateId: $affiliateId

  ) {
    parentBranch
    operatorSpreads {
      operator {
        fullName
        uuid
      }
      percentage
    }
    uuid
    countries
    languages
    partners {
      uuid
      fullName
    }
    sources
    priority
    name
    type
    updatedBy
    createdBy
  }
}
`;

const GetRulesQuery = ({ children, match: { params: { id } }, location: { state }, type }) => (
  <Query
    query={REQUEST}
    variables={{
      ...state?.filters,
      ...(type === 'PARTNER' && { affiliateId: get(state, 'filters.affiliateId') || id }),
      ...(type === 'OPERATOR' && { operatorUuids: [...get(state, 'filters.operatorUuids') || '', id] }),
    }}
    fetchPolicy="cache-and-network"
    context={{ batch: false }}
  >
    {children}
  </Query>
);

GetRulesQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.object,
  }).isRequired,
  type: PropTypes.string,
};

GetRulesQuery.defaultProps = {
  type: '',
};

export default GetRulesQuery;
