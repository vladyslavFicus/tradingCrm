import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query getRules(
  $uuid: [String],
  $country: String,
  $language: String,
  $createdByOrUuid: String,
  $name: String,
  $type: RuleTypeEnum,
  $parentId: String,
  $operatorUuids: [String],
  $affiliateId: String,
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
    
  ) {
    error {
      error
      fields_errors
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
}
`;

const GetRulesQuery = ({ children, match: { params: { id: parentId } }, location: { query } }) => (
  <Query query={REQUEST} variables={{ ...query && query.filters, parentId }} fetchPolicy="cache-and-network">
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
    query: PropTypes.object,
  }).isRequired,
};

export default GetRulesQuery;
