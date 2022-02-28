import React from 'react';
import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`mutation LeadProfileTab_UpdateLeadMutation(
  $uuid: String!
  $name: String
  $surname: String
  $phone: String
  $mobile: String
  $email: String
  $country: String
  $birthDate: String
  $gender: String
  $city: String
) {
  leads {
    update (
      uuid: $uuid
      name: $name
      surname: $surname
      phone: $phone
      mobile: $mobile
      email: $email
      country: $country
      birthDate: $birthDate
      gender: $gender
      city: $city
    )
  }
}
`;

const UpdateLeadMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateLeadMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateLeadMutation;
