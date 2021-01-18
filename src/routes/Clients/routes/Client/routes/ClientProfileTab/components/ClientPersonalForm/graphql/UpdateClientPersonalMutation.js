import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation ClientPersonalForm_UpdateClientPersonalMutation(
    $playerUUID: String!
    $firstName: String!
    $lastName: String!
    $languageCode: String!
    $gender: String
    $birthDate: String
    $passport: Passport__Input
    $identificationNumber: String
    $timeZone: String
  ) {
    profile {
      updatePersonalInformation(
        playerUUID: $playerUUID
        firstName: $firstName
        lastName: $lastName
        languageCode: $languageCode
        gender: $gender
        birthDate: $birthDate
        passport: $passport
        identificationNumber: $identificationNumber
        timeZone: $timeZone
      ) {
        _id
        firstName
        lastName
        birthDate
        languageCode
        gender
        identificationNumber
        timeZone
        passport {
          countryOfIssue
          countrySpecificIdentifier
          countrySpecificIdentifierType
          expirationDate
          issueDate
          number
        }
      }
    }
  }
`;

const UpdateClientPersonalMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateClientPersonalMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateClientPersonalMutation;
