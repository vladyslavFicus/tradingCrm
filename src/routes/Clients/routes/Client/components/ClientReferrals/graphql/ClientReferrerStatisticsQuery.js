import React from 'react';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`
  query ClientReferrals_ClientReferrerStatisticsQuery(
    $uuid: String!
  ) {
    referrerStatistics(uuid: $uuid) {
      referralsCount
      ftdCount
      remunerationTotalAmount
    }
  }
`;

const ClientReferrerStatisticsQuery = ({ children, clientUuid }) => (
  <Query query={REQUEST} variables={{ uuid: clientUuid }}>
    {children}
  </Query>
);

ClientReferrerStatisticsQuery.propTypes = {
  children: PropTypes.func.isRequired,
  clientUuid: PropTypes.string.isRequired,
};

export default ClientReferrerStatisticsQuery;
