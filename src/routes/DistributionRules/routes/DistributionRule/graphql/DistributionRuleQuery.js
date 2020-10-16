import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query DistributionRuleQuery($uuid: String!) {
    distributionRule (uuid: $uuid) {
      _id
      uuid
      name
      status
      createdBy
      statusChangedAt
      createdAt
      countries
      salesStatuses
      targetSalesStatus
      registrationPeriodInHours
      executionType
      executionPeriodInHours
      latestMigration {
        startDate
      }
      sourceBrandConfigs {
        brand
        distributionUnit {
          quantity
          baseUnit
        }
        sortType
      }
      targetBrandConfigs {
        brand
        distributionUnit {
          quantity
          baseUnit
        }
        operator
      }
    }
  }
`;

const DistributionRuleQuery = ({ children, match: { params: { id } } }) => (
  <Query
    query={REQUEST}
    variables={{ uuid: id }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

DistributionRuleQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default DistributionRuleQuery;