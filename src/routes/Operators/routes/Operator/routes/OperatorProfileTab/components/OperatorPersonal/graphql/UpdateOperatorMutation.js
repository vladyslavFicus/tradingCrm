import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation OperatorPersonal_UpdateOperatorPersonalFormMutation(
    $uuid: String!
    $firstName: String!
    $lastName: String!
    $phoneNumber: String
    $clickToCall: OperatorUpdate__ClickToCall__Input
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
        clickToCall {
          didlogicPhone
          asteriskPhone
          commpeakPhone
        }
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
