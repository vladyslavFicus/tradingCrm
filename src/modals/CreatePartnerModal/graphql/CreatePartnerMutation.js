import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation CreatePartnerModal_CreatePartner(
    $email: String!
    $firstName: String!
    $lastName: String!
    $phone: String
    $password: String!
    $externalAffiliateId: String
    $public: Boolean
  ) {
    partner {
      createPartner(
        email: $email
        firstName: $firstName
        lastName: $lastName
        phone: $phone
        password: $password
        externalAffiliateId: $externalAffiliateId
        public: $public
      ) {
        uuid
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
