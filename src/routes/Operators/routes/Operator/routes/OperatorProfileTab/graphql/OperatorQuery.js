import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query Operator_OperatorQuery(
    $uuid: String!
  ) {
    operator(uuid: $uuid) {
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
        coperatoPhone
      }
      registeredBy
      registrationDate
      statusChangeAuthor
      statusChangeDate
      statusReason
      uuid
      authorities {
        brand
        department
        id
        role
      }
      hierarchy {
        uuid
        userType
      }
    }
  }
`;

const OperatorQuery = ({ children, match: { params: { id } } }) => (
  <Query
    query={REQUEST}
    variables={{ uuid: id }}
    fetchPolicy="network-only"
  >
    {children}
  </Query>
);

OperatorQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default OperatorQuery;
