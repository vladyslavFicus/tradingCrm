import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query PaymentMethodsQuery {
  paymentMethods {
    data
    error {
      error
    }
  }
}`;

const PaymentMethodsQuery = ({ children }) => (
  <Query query={REQUEST}>{children}</Query>
);

PaymentMethodsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default PaymentMethodsQuery;
