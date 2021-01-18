import React from 'react';
import PropTypes from 'constants/propTypes';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

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
