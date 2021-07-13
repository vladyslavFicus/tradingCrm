import React, { PureComponent } from 'react';
import PropTypes from 'constants/propTypes';
import { get } from 'lodash';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import Chart from '../Chart';
import { getChartSelectOptions, mapTotalObject } from '../dashboardChartsUtils';
import DepositPaymentsStatistic from './graphql/DepositPaymentsStatistic';

class DepositAmountChart extends PureComponent {
  static propTypes = {
    depositPaymentsStatistic: PropTypes.paymentsStatistic.isRequired,
  };

  handleSelectChange = ({ dateFrom, dateTo }) => {
    this.props.depositPaymentsStatistic.refetch({
      dateFrom,
      dateTo,
    });
  };

  tooltipAmountFormatter = value => I18n.toCurrency(value, { unit: '' });

  render() {
    const { depositPaymentsStatistic } = this.props;

    return (
      <Chart
        title={I18n.t('DASHBOARD.DEPOSITS_AMOUNT_CHART.TITLE')}
        tooltipContent={I18n.t('DASHBOARD.DEPOSITS_AMOUNT_CHART.TOOLTIP_TITLE')}
        tooltipAmountFormatter={this.tooltipAmountFormatter}
        data={get(depositPaymentsStatistic, 'data.paymentsStatistic.items', [])}
        totals={
          mapTotalObject(
            get(depositPaymentsStatistic, 'data.paymentsStatistic.additionalTotal', {}),
            'amount',
          )
        }
        hasResults={!get(depositPaymentsStatistic, 'error') || true}
        onSelectChange={this.handleSelectChange}
        selectOptions={getChartSelectOptions}
        loading={depositPaymentsStatistic.loading}
        chartAndTextColor="#1565d6"
        lineDataKey="amount"
        xDataKey="entryDate"
        withCurrency
      />
    );
  }
}

export default withRequests({
  depositPaymentsStatistic: DepositPaymentsStatistic,
})(DepositAmountChart);
