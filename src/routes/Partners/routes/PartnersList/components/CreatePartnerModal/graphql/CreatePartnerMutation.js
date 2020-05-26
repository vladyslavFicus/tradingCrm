import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation CreatePartnerModal_CreatePartner(
    $email: String!
    $firstName: String!
    $lastName: String!
    $phone: String
    $password: String!
    $satellite: String
    $externalAffiliateId: String
    $public: Boolean
    $cellexpert: Boolean
  ) {
    partner {
      createPartner(
        email: $email
        firstName: $firstName
        lastName: $lastName
        phone: $phone
        password: $password
        satellite: $satellite
        externalAffiliateId: $externalAffiliateId
        public: $public
        cellexpert: $cellexpert
      ) {
        data {
          uuid
        }
        error {
          error
          fields_errors
        }
      }
    }
  }
`;

const CreatePartnerMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

CreatePartnerMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default CreatePartnerMutation;
