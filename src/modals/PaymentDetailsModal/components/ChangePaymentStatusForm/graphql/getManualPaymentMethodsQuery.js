import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query ChangePaymentStatusForm_getManualPaymentMethods {
    manualPaymentMethods
  }
`;

const getManualPaymentMethodsQuery = ({ children }) => (
  <Query query={REQUEST}>
    {children}
  </Query>
);

getManualPaymentMethodsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default getManualPaymentMethodsQuery;
