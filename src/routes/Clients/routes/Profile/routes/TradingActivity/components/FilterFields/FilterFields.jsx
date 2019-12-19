import React, { Component } from 'react';
import { get } from 'lodash';
import history from 'router/history';
import PropTypes from 'constants/propTypes';
import ListFilterForm from 'components/ListFilterForm';
import filterFields from '../../attributes/filterFields';

class FilterForm extends Component {
  static propTypes = {
    tradingAccounts: PropTypes.shape({
      tradingAccount: PropTypes.array,
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    operators: PropTypes.shape({
      operators: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.tradingActivityOriginalAgent),
        error: PropTypes.object,
      }),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
  };

  componentWillUnmount() {
    this.handleFilterReset();
  }

  handleApplyFilters = (values) => {
    history.replace({
      query: {
        filters: {
          ...values,
          ...values.tradeId && { tradeId: Number(values.tradeId) },
          ...values.volumeFrom && { volumeFrom: Number(values.volumeFrom) },
          ...values.volumeTo && { volumeTo: Number(values.volumeTo) },
        },
      },
    });
  }

  handleFilterReset = () => {
    history.replace({
      query: { filters: {} },
    });
  }

  render() {
    const {
      operators: {
        operators,
        loading: operatorsLoading,
      },
      tradingAccounts,
      tradingAccounts: {
        loading: tradingAccountsLoading,
      },
    } = this.props;

    const accounts = get(tradingAccounts, 'tradingAccount') || [];
    const originalAgents = get(operators, 'data.content') || [];
    const disabledOriginalAgentField = get(operators, 'error') || operatorsLoading;

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

export default FilterForm;
