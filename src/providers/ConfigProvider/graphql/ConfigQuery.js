import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
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
      profile {
        isDepositEnabled
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
      wet {
        leveragesChangingRequest
        live {
          enabled
        }
        demo {
          enabled
        }
      }
      sms {
        coperato {
          isActive
        }
      }
      email {
        templatedEmails
      }
      clientPortal {
        url
      }
      clientPortalLanding {
        signUp
      }
      affiliate {
        restriction {
          minFtdDeposit
        }
      }
    }
  }
`;

const ConfigQuery = ({ children }) => (
  <Query query={REQUEST} variables={{ brandId: getBrand()?.id }} fetchPolicy="cache-and-network">
    {children}
  </Query>
);

ConfigQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ConfigQuery;
