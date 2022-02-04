import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

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
