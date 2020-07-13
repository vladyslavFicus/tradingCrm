import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const AcquisitionOperatorFragment = gql`
  fragment AcquisitionOperatorFragment on Operator {
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

const REQUEST = gql`query ReferralsQuery($uuid: String!) {
  referrals(uuid: $uuid) {
    page
    number
    totalElements
    size
    last
    content {
      referralInfo {
        name
        profileUuid
        languageCode
        registrationDate
      }
      bonusType
      ftdInfo {
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
        acquisitionStatus
        retentionOperator {
          ...AcquisitionOperatorFragment
        }
        retentionStatus
        salesOperator {
          ...AcquisitionOperatorFragment
        }
        salesStatus
      }
    }
  }
}
${AcquisitionOperatorFragment}`;

const ReferralsQuery = ({ children, match: { params: { id: uuid } } }) => (
  <Query
    query={REQUEST}
    variables={{
      uuid,
      page: 0,
      limit: 20,
    }}
  >
    {children}
  </Query>
);

ReferralsQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.object.isRequired,
  }).isRequired,
};

export default ReferralsQuery;
