import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query SocialTrading_getSocialTradingSubscribers(
    $profileUuid: String!
  ) {
    socialTrading {
      subscribers(profileUuid: $profileUuid) {
        data {
          priceMode
          stopLoss
          takeProfit
          subscriberId
          shareAction {
            typeSharing
            multiplicator
            reverse
          }
          status
          minimumLot
          maximumLot
          maxDeviation
          symbols
          isArchive
          subscriberName
          totalPerformanceFee
          sourceId
          sourceName
          created
          updated
        }
        error {
          error
        }
      }
    }
  }
`;

const getSocialTradingSubscribersQuery = ({ children, profileUuid }) => (
  <Query
    query={REQUEST}
    variables={{ profileUuid }}
    fetchPolicy="network-only"
  >
    {children}
  </Query>
);

getSocialTradingSubscribersQuery.propTypes = {
  children: PropTypes.func.isRequired,
  profileUuid: PropTypes.string.isRequired,
};

export default getSocialTradingSubscribersQuery;
