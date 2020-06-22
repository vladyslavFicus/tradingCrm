import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation UpdateOperatorPersonalFormMutation_updateOperator(
  $uuid: String!
  $firstName: String!
  $lastName: String!
  $phoneNumber: String
  $sip: String
  $country: String
) {
  operator {
    updateOperator(
      uuid: $uuid
      firstName: $firstName
      lastName: $lastName
      phoneNumber: $phoneNumber
      sip: $sip
      country: $country
    ) {
      data {
        _id
        country
        email
        fullName
        firstName
        lastName
        operatorStatus
        phoneNumber
        sip
        registeredBy
        registrationDate
        statusChangeAuthor
        statusChangeDate
        statusReason
        uuid
      }
      error {
        error
      }
    }
  }
}`;

const UpdateOperatorPersonalFormMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateOperatorPersonalFormMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateOperatorPersonalFormMutation;
