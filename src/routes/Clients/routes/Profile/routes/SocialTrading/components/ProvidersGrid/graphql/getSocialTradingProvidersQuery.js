import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query SocialTrading_getSocialTradingProviders(
    $profileUuid: String!
  ) {
    socialTrading {
      providers(profileUuid: $profileUuid) {
        data {
          id
          name
          status
          summary
          currency
          isActive
          isPublic
          companyFee
          description
          feeReceiver
          joinMinBalance
          performanceFee
        }
        error {
          error
        }
      }
    }
  }
`;

const getSocialTradingProvidersQuery = ({ children, profileUuid }) => (
  <Query
    query={REQUEST}
    variables={{ profileUuid }}
    fetchPolicy="network-only"
  >
    {children}
  </Query>
);

getSocialTradingProvidersQuery.propTypes = {
  children: PropTypes.func.isRequired,
  profileUuid: PropTypes.string.isRequired,
};

export default getSocialTradingProvidersQuery;
