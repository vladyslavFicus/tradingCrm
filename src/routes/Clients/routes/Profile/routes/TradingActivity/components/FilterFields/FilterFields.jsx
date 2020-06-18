import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';

import ListFilterForm from 'components/ListFilterForm';
import filterFields from '../../attributes/filterFields';

import {
  TradingAccountsQuery,
  OperatorsQuery,
} from './graphql';

class FilterForm extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    tradingAccountsQuery: PropTypes.query({
      tradingAccount: PropTypes.array, // ?
    }).isRequired,
    operatorsQuery: PropTypes.query({
      operators: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.tradingActivityOriginalAgent),
        error: PropTypes.object,
      }),
    }).isRequired,
  };

  componentWillUnmount() {
    this.handleFilterReset();
  }

  handleApplyFilters = (values) => {
    this.props.history.replace({
      query: {
        filters: {
          ...values,
          ...values.tradeId && { tradeId: Number(values.tradeId) },
          ...values.volumeFrom && { volumeFrom: Number(values.volumeFrom) },
          ...values.volumeTo && { volumeTo: Number(values.volumeTo) },
        },
      },
    });
  };

  handleFilterReset = () => {
    this.props.history.replace({
      query: { filters: {} },
    });
  };

  render() {
    const {
      operatorsQuery: {
        data: operatorsData,
        loading: operatorsLoading,
      },
      tradingAccountsQuery: {
        data: tradingAccountsData,
        loading: tradingAccountsLoading,
      },
    } = this.props;

    const accounts = get(tradingAccountsData, 'tradingAccount') || [];
    const originalAgents = get(operatorsData, 'operators.data.content') || [];
    const disabledOriginalAgentField = get(operatorsData, 'operators.error') || operatorsLoading;

    return (
      <ListFilterForm
        onSubmit={this.handleApplyFilters}
        onReset={this.handleFilterReset}
        fields={filterFields({
          disabled: tradingAccountsLoading,
          accounts,
          originalAgents,
          disabledOriginalAgentField,
        })}
        initialValues={{ tradeType: 'LIVE' }}
      />
    );
  }
}

export default compose(
  withRouter,
  withRequests({
    tradingAccountsQuery: TradingAccountsQuery,
    operatorsQuery: OperatorsQuery,
  }),
)(FilterForm);
