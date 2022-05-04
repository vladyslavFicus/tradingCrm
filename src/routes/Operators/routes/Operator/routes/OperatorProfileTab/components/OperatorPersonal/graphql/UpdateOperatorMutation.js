import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation OperatorPersonal_UpdateOperatorPersonalFormMutation(
    $uuid: String!
    $firstName: String!
    $lastName: String!
    $phoneNumber: String
    $clickToCall: Object
    $country: String
  ) {
    operator {
      updateOperator(
        uuid: $uuid
        firstName: $firstName
        lastName: $lastName
        phoneNumber: $phoneNumber
        clickToCall: $clickToCall
        country: $country
      ) {
        _id
        country
        email
        fullName
        firstName
        lastName
        operatorStatus
        phoneNumber
        clickToCall
        registeredBy
        registrationDate
        statusChangeAuthor
        statusChangeDate
        statusReason
        uuid
      }
    }
  }
`;

const UpdateOperatorPersonalFormMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateOperatorPersonalFormMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateOperatorPersonalFormMutation;
