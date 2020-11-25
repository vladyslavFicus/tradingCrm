import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query DistributionRuleQuery($uuid: String!) {
    distributionRule (uuid: $uuid) {
      _id
      uuid
      name
      order
      status
      statusChangedAt
      createdAt
      updatedAt
      countries
      languages
      affiliateUuids
      firstTimeDeposit
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
        operatorEntity {
          uuid
          fullName
        }
      }
    }
  }
`;

const DistributionRuleQuery = ({ children, match: { params: { id } } }) => (
  <Query
    query={REQUEST}
    variables={{ uuid: id }}
    fetchPolicy="network-only"
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
