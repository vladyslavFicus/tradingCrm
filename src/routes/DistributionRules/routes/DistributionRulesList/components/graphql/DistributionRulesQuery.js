import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query DistributionRules__GetDistributionRules($args: DistributionRuleSearch__Input) {
  distributionRules (args: $args) {
    content {
      uuid
      name
      order
      status
      createdBy
      statusChangedAt
      createdAt
      countries
      languages
      salesStatuses
      targetSalesStatus
      registrationPeriodInHours
      registrationDateRange {
        from
        to
      }
      executionType
      executionPeriodInHours
      latestMigration {
        uuid
        startDate
        clientsAmount
        status
        ruleUuid
      }
      sourceBrandConfigs {
        uuid
        brand
        distributionUnit {
          quantity
          baseUnit
        }
        sortType
      }
      targetBrandConfigs {
        uuid
        brand
        distributionUnit {
          quantity
          baseUnit
        }
        operator
        country
      }
    }
    page
    number
    totalElements
    size
    last
  }
}
`;

const GetDistributionRulesQuery = ({ children, location: { query } }) => (
  <Query
    query={REQUEST}
    variables={{
      args: {
        ...query && query.filters,
        page: 0,
        size: 10,
      },
    }}
    fetchPolicy="cache-and-network"
    context={{ batch: false }}
  >
    {children}
  </Query>
);

GetDistributionRulesQuery.propTypes = {
  children: PropTypes.func.isRequired,
  location: PropTypes.shape({
    query: PropTypes.object,
  }).isRequired,
};

export default GetDistributionRulesQuery;
