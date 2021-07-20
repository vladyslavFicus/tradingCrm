import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query SmsSendModal__CoperatoNumbersQuery {
    sms {
      coperato {
        numbers {
          number
          country
        }
      }
    }
  }
`;

const CoperatoNumbersQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="cache-and-network">
    {children}
  </Query>
);

CoperatoNumbersQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default CoperatoNumbersQuery;
