import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query RulesQuery(
  $uuid: [String]
  $country: String
  $language: String
  $createdByOrUuid: String
  $name: String
  $type: Rule__Type__Enum
  $parentId: String
  $operatorUuids: [String]
  $affiliateId: String
  $uuids: [String]
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
    uuids: $uuids
  ) {
    name
    type
    priority
    countries
    languages
    sources
    parentBranch
    ruleType
    operatorSpreads {
      parentUser
      percentage
    }
    partners {
      uuid
      fullName
    }
    enableSchedule
    schedules {
      days
      timeIntervals {
        operatorSpreads {
          parentUser
          percentage
        }
        timeFrom
        timeTo
      }
    }
  }
}
`;

const RulesQuery = ({ children, uuid }) => (
  <Query
    query={REQUEST}
    variables={{ uuids: [uuid] }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

RulesQuery.propTypes = {
  children: PropTypes.func.isRequired,
  uuid: PropTypes.string.isRequired,
};

export default RulesQuery;
