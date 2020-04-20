import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query getPartnerByUUID($uuid: String!) {
    partner(uuid: $uuid) {
      data {
        _id
        uuid
        firstName
        lastName
        fullName
        email
        phone
        country
        status
        statusChangeDate
        statusChangeAuthor
        statusReason
        satellite
        createdBy
        createdAt
        externalAffiliateId
        affiliateType
        cellexpert
        public
        tradingAccountAutocreation
        tradingAccountType
        tradingAccountCurrency
        permission {
          allowedIpAddresses
          forbiddenCountries
          showNotes
          showSalesStatus
          showFTDAmount
          showKycStatus
        }
        authorities {
          data {
            brandId
            department
            id
            role
          }
        }
      }
      error {
        error
        fields_errors
      }
    }
  }
`;

const PartnersQuery = ({ children }) => (
  <Query query={REQUEST}>{children}</Query>
);

PartnersQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default PartnersQuery;
