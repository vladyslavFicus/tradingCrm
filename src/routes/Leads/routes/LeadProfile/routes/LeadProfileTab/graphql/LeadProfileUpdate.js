import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation updateLeadProfile(
  $uuid: String!,
  $name: String,
  $surname: String,
  $phone: String,
  $mobile: String,
  $email: String,
  $country: String,
  $birthDate: String,
  $gender: String,
  $city: String,
) {
  leads {
    update (
      uuid: $uuid,
      name: $name,
      surname: $surname,
      phone: $phone,
      mobile: $mobile,
      email: $email,
      country: $country,
      birthDate: $birthDate,
      gender: $gender,
      city: $city,
    ) {
      data {
        _id
        uuid
        name
        surname
        phone
        mobile
        email
        country
        birthDate
        gender
        city
      }
      error {
        error
        fields_errors
      }
    }
  }
}`;

const UpdateLeadProfile = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateLeadProfile.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateLeadProfile;
