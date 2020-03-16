import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query SocialTrading_getSocialTradingSubscriptionsOnProviders(
    $providerId: Int!
  ) {
    socialTrading {
      subscriptionsOnProviders(
        providerId: $providerId
      ) {
        data {
          subscriberId
          subscriberName
          shareAction {
            typeSharing
            reverse
          }
          sourceId
          sourceName
        }
        error {
          error
        }
      }
    }
  }
`;

const getSocialTradingSubscriptionsOnProvidersQuery = ({ children, providerId }) => (
  <Query
    query={REQUEST}
    variables={{ providerId }}
    fetchPolicy="network-only"
  >
    {children}
  </Query>
);

getSocialTradingSubscriptionsOnProvidersQuery.propTypes = {
  children: PropTypes.func.isRequired,
  providerId: PropTypes.number.isRequired,
};

export default getSocialTradingSubscriptionsOnProvidersQuery;
