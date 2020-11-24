import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`query getRules(
  $uuid: [String],
  $country: String,
  $language: String,
  $createdByOrUuid: String,
  $name: String,
  $type: Rule__Type__Enum,
  $parentId: String,
  $operatorUuids: [String],
  $affiliateId: String,
  $uuids: [String],
) {
  rules (
    uuid: $uuid,
    country: $country,
    language: $language,
    createdByOrUuid: $createdByOrUuid,
    name: $name,
    type: $type,
    parentId: $parentId,
    operatorUuids: $operatorUuids,
    affiliateId: $affiliateId,
    uuids: $uuids,

  ) {
    actions {
      id
      parentBranch
      parentUser
      ruleType
      operatorSpreads {
        id,
        operator {
          fullName,
          uuid,
        },
        parentUser,
        percentage,
      },
    }
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
}
`;

const GetRulesQuery = ({ children, uuid }) => (
  <Query
    query={REQUEST}
    variables={{ uuids: [uuid] }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

GetRulesQuery.propTypes = {
  children: PropTypes.func.isRequired,
  uuid: PropTypes.string.isRequired,
};

export default GetRulesQuery;
