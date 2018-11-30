import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from '../../../../../constants/propTypes';
import Chart from '../../../../../components/Chart';
import { paymentsStatisticQuery } from '../../../../../graphql/queries/statistics';
import ChartFooter from './ChartFooter';
import { getChartSelectOptions, initialQueryParams } from './chartUtils';

class PaymentsChartWrapper extends Component {
  static propTypes = {
    paymentsStatistic: PropTypes.shape({
      refetch: PropTypes.func.isRequired,
      loading: PropTypes.bool.isRequired,
      statistics: PropTypes.shape({
        payments: PropTypes.shape({
          data: PropTypes.shape({
            items: PropTypes.arrayOf(
              PropTypes.shape({
                deposits: PropTypes.paymentEntry,
                withdraws: PropTypes.paymentEntry,
              }).isRequired
            ).isRequired,
            totalDepositsCount: PropTypes.number.isRequired,
            totalDepositsAmount: PropTypes.number.isRequired,
            totalWithdrawsCount: PropTypes.number.isRequired,
            totalWithdrawsAmount: PropTypes.number.isRequired,
          }),
          error: PropTypes.object,
        }).isRequired,
      }),
    }).isRequired,
    color: PropTypes.string.isRequired,
    totalFieldName: PropTypes.string.isRequired,
    dataKey: PropTypes.string.isRequired,
    headerTitle: PropTypes.string.isRequired,
    tooltipСontent: PropTypes.string.isRequired,
    noResultsText: PropTypes.string.isRequired,
  };

  handleSelectChange = ({ from: dateFrom, to: dateTo }) => {
    this.props.paymentsStatistic.refetch({
      dateFrom,
      dateTo,
    });
  };

  render() {
    const {
      paymentsStatistic: { loading, statistics },
      color,
      totalFieldName,
      dataKey,
      headerTitle,
      tooltipСontent,
      noResultsText,
    } = this.props;

    const { [totalFieldName]: total, items } = get(statistics, 'payments.data') || {};
    const error = get(statistics, 'payments.error', {});
    const noResults = !!error || (!loading && items.length === 0);

    return (
      <div className="card">
        <div className="card-body chart-card">
          <Chart
            headerTitle={headerTitle}
            selectOptions={getChartSelectOptions()}
            onSelectChange={this.handleSelectChange}
            data={items}
            tooltipСontent={tooltipСontent}
            lines={[
              {
                type: 'monotone',
                dataKey,
                stroke: color,
              },
            ]}
            footer={
              <ChartFooter
                noResults={noResults}
                // fix untill new payment api
                totals={{ total: { count: total } }}
                color={color}
              />
            }
            loading={loading}
            noResults={noResults}
            noResultsText={noResultsText}
          />
        </div>
      </div>
    );
  }
}

export default graphql(paymentsStatisticQuery, {
  options: () => ({
    variables: { ...initialQueryParams('dateFrom', 'dateTo') },
  }),
  name: 'paymentsStatistic',
})(PaymentsChartWrapper);
