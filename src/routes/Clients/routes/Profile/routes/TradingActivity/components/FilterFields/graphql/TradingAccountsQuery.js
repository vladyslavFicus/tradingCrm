import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query TradingAccountsQuery($uuid: String!) {
    tradingAccount(uuid: $uuid) {
      accountUUID
      currency
      balance
      credit
      margin
      name
      login
      group
      accountType
      platformType
      archived
      leverage
      readOnlyUpdateTime
      readOnlyUpdatedBy
      readOnly
      profileUUID
      operator {
        fullName
      }
      lastLeverageChangeRequest {
        changeLeverageFrom
        changeLeverageTo
        status
        createDate
      }
    }
  }
`;

const TradingAccountsQuery = ({
  children,
  match: {
    params: { id: uuid },
  },
}) => (
  <Query
    query={REQUEST}
    variables={{
      uuid,
    }}
  >
    {children}
  </Query>
);

TradingAccountsQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default TradingAccountsQuery;
