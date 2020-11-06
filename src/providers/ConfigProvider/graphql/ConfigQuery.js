import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { getBrand } from 'config';

const REQUEST = gql`
  query ConfigQuery($brandId: String!) {
    config(brandId: $brandId) {
      env
      currencies {
        base
        supported
      }
      locales {
        defaultLanguage
        languages
      }
      password {
        pattern
        mt4_pattern
        mt4
        mt5
      }
      payment {
        reasons
      }
      mt4 {
        leveragesChangingRequest
        live {
          enabled
        }
        demo {
          enabled
        }
      }
      mt5 {
        leveragesChangingRequest
        live {
          enabled
        }
        demo {
          enabled
        }
      }
      clickToCall {
        isActive
        asterisk {
          isActive
          prefixes
        }
      }
      email {
        templatedEmails
      }
      clientPortal {
        url
      }
    }
  }
`;

const ConfigQuery = ({ children }) => (
  <Query query={REQUEST} variables={{ brandId: getBrand()?.id }} fetchPolicy="network-only">
    {children}
  </Query>
);

ConfigQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ConfigQuery;
