import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query Partner_PartnerQuery(
    $uuid: String!
  ) {
    partner(
      uuid: $uuid
    ) {
      _id
      uuid
      firstName
      lastName
      fullName
      email
      externalAffiliateId
      public
      phone
      country
      status
      statusChangeDate
      statusChangeAuthor
      createdBy
      createdAt
      cdeAffiliate
      permission {
        allowedIpAddresses
        forbiddenCountries
        showSalesStatus
        showFTDAmount
        showKycStatus
        showNotes
        minFtdDeposit
      }
      schedule {
        configId
        activated
        countrySpreads {
          country
          limit
        },
        day
        totalLimit
        workingHoursFrom
        workingHoursTo
      }
      authorities {
        department
        id
        role
      }
    }
  }
`;

const PartnerQuery = ({ children, match: { params: { id } } }) => (
  <Query query={REQUEST} variables={{ uuid: id }} fetchPolicy="network-only">
    {children}
  </Query>
);

PartnerQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default PartnerQuery;
