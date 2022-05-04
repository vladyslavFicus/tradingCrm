import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query OperatorPersonal_ClickToCallConfigQuery {
    clickToCall {
      configs {
        callSystem
      }
    }
  }
`;

const ClickToCallConfigQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="cache-and-network">
    {children}
  </Query>
);

ClickToCallConfigQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ClickToCallConfigQuery;
