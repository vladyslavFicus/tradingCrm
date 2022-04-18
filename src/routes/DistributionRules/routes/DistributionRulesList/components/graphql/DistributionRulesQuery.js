import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

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
      executionType
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
        countries
        languages
        salesStatuses
        timeInCurrentStatusInHours
        registrationPeriodInHours
        registrationDateRange {
          from
          to
        }
        distributionUnit {
          quantity
          baseUnit
        }
        sortType
      }
      targetBrandConfigs {
        uuid
        brand
        targetSalesStatus
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
        ...query?.filters,
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
