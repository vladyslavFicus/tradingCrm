import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import Chart from 'components/Chart';
import { paymentsStatisticQuery } from 'graphql/queries/statistics';
import ChartFooter from './ChartFooter';
import { getChartSelectOptions, initialPaymentQueryParams, mapTotalObject } from './chartUtils';

export default (paymentType, paymentStatus) => {
  class PaymentsChart extends Component {
    static propTypes = {
      paymentsStatistic: PropTypes.shape({
        refetch: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        statistics: PropTypes.shape({
          payments: PropTypes.shape({
            data: PropTypes.shape({
              items: PropTypes.arrayOf(
                PropTypes.shape({
                  amount: PropTypes.number,
                  count: PropTypes.number,
                  entryDate: PropTypes.string,
                }).isRequired,
              ).isRequired,
              totalCount: PropTypes.number,
              totalAmount: PropTypes.number,
              monthCount: PropTypes.number,
              monthAmount: PropTypes.number,
              todayCount: PropTypes.number,
              todayAmount: PropTypes.number,
            }),
            error: PropTypes.object,
          }).isRequired,
        }),
      }).isRequired,
      color: PropTypes.string.isRequired,
      dataKey: PropTypes.string.isRequired,
      headerTitle: PropTypes.string.isRequired,
      tooltipContent: PropTypes.string.isRequired,
      noResultsText: PropTypes.string.isRequired,
      showFooterCurrency: PropTypes.bool,
    };

    static defaultProps = {
      showFooterCurrency: false,
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
        dataKey,
        headerTitle,
        tooltipContent,
        noResultsText,
        showFooterCurrency,
      } = this.props;

      const { additionalTotal, items } = get(statistics, 'payments.data') || { items: [] };
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
              tooltipContent={tooltipContent}
              lines={[
                {
                  type: 'monotone',
                  dataKey,
                  stroke: color,
                },
              ]}
              footer={(
                <ChartFooter
                  noResults={noResults}
                  totals={mapTotalObject(additionalTotal, dataKey)}
                  color={color}
                  withCurrency={showFooterCurrency}
                />
              )}
              loading={loading}
              noResults={noResults}
              noResultsText={noResultsText}
            />
          </div>
        </div>
      );
    }
  }

  return graphql(paymentsStatisticQuery, {
    options: () => ({
      variables: { ...initialPaymentQueryParams('dateFrom', 'dateTo', { paymentType, paymentStatus }) },
      fetchPolicy: 'network-only',
    }),
    name: 'paymentsStatistic',
  })(PaymentsChart);
};
