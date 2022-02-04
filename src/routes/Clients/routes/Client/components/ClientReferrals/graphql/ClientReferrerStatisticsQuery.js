import React from 'react';
import PropTypes from 'constants/propTypes';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query ClientReferrals_ClientReferrerStatisticsQuery(
    $uuid: String!
  ) {
    referrerStatistics(uuid: $uuid) {
      referralsCount
      ftdCount
      remunerationTotalAmount
    }
  }`;

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
