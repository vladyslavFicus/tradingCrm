import React from 'react';
import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`mutation PartnerPersonalInfoForm_UpdatePartnerMutation(
  $uuid: String!
  $firstName: String!
  $lastName: String!
  $phone: String
  $country: String
  $email: String
  $permission: PartnerPermission__Input
  $externalAffiliateId: String
  $public: Boolean
  $cdeAffiliate: Boolean
) {
  partner {
    updatePartner(
      uuid: $uuid
      firstName: $firstName
      lastName: $lastName
      phone: $phone
      country: $country
      email: $email
      permission: $permission
      externalAffiliateId: $externalAffiliateId
      public: $public
      cdeAffiliate: $cdeAffiliate
    )
  }
}`;

const UpdatePartnerMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdatePartnerMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdatePartnerMutation;
