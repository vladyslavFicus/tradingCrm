import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation TradingEngine_ChangeAccountSettingsMutation(
   $accountUuid: String!
   $readOnly: Boolean
) {
  tradingEngine {
    changeAccountSettings(
      accountUuid: $accountUuid
      readOnly: $readOnly
    ) {
      _id
      readOnly
    }
  }
}
`;

const ChangeAccountSettingsMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

ChangeAccountSettingsMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ChangeAccountSettingsMutation;
