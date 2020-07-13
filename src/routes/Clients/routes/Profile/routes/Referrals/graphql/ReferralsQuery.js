import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const AcquisitionOperatorFragment = gql`
  fragment AcquisitionOperator on Refferals {
    fullName
    hierarchy {
      parentBranches {
        name
        branchType
        parentBranch {
          name
          branchType
        }
      }
    }
  }
`;

const REQUEST = gql`query ReferralsQuery {
  referrals {
    page
    number
    totalElements
    size
    last
    content {
      uuid
      firstName
      lastName
      languageCode
      address {
        countryCode
      }
      bonusType
      registrationDetails {
        registrationDate
      }
      ftd {
        date
        amount
        currency
        normalizedAmount
      }
      remuneration {
        date
        amount
        currency
        normalizedAmount
      }
      acquisition {
        salesStatus
        salesOperator {
          ...AcquisitionOperatorFragment
        }
        retentionStatus
        retentionOperator {
          ...AcquisitionOperatorFragment
        }
        acquisitionStatus
      }
    }
  }
}
${AcquisitionOperatorFragment}`;

const ReferralsQuery = ({ children }) => (
  <Query query={REQUEST}>
    {children}
  </Query>
);

ReferralsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ReferralsQuery;
