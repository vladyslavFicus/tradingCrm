import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation AddPayment(
    $accountUUID: String
    $amount: Float!
    $country: String
    $externalReference: String
    $expirationDate: String
    $login: Int
    $paymentType: String!
    $paymentMethod: String
    $profileUUID: String
    $source: String
    $target: String
  ) {
    payment {
      createPayment(
        accountUUID: $accountUUID
        amount: $amount
        paymentType: $paymentType
        externalReference: $externalReference
        expirationDate: $expirationDate
        login: $login
        source: $source
        target: $target
        country: $country
        paymentMethod: $paymentMethod
        profileUUID: $profileUUID
      ) {
        paymentId
      }
    }
  }
`;

const AddPayment = ({ children }) => (
  <Mutation mutation={REQUEST}>{children}</Mutation>
);

AddPayment.propTypes = {
  children: PropTypes.func.isRequired,
};

export default AddPayment;
