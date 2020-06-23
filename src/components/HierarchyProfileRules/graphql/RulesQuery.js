import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'constants/propTypes';
import { deskTypes } from 'constants/rules';

const RulesRequest = gql`query RulesQuery(
  $uuid: [String],
  $country: String,
  $language: String,
  $createdByOrUuid: String,
  $name: String,
  $type: RuleTypeEnum,
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
    error {
      error
    }
    data {
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
}`;

const RetentionRulesRequest = gql`query RetentionRulesQuery(
  $uuid: [String],
  $country: String,
  $language: String,
  $createdByOrUuid: String,
  $name: String,
  $parentId: String,
) {
  rulesRetention (
    uuid: $uuid,
    country: $country,
    language: $language,
    createdByOrUuid: $createdByOrUuid,
    name: $name,
    parentId: $parentId,
  ) {
    error {
      error
    }
    data {
      actions {
        id
        parentBranch
        parentUser
        ruleType
      }
      uuid
      countries
      languages
      priority
      name
      type
      updatedBy
      createdBy
    }
  } 
}`;

const RulesQuery = ({
  children,
  deskType,
  location: { query },
  match: { params: { id: branchUuid } },
}) => (
  <Query
    query={
      deskType === deskTypes.RETENTION ? RetentionRulesRequest : RulesRequest
    }
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
  deskType: PropTypes.string.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default RulesQuery;
