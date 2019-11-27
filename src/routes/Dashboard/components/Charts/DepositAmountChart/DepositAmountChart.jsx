import React, { Component } from 'react';
import PropTypes from 'constants/propTypes';
import { get } from 'lodash';
import I18n from 'i18n-js';
import Chart from '../Chart';
import { getChartSelectOptions, mapTotalObject } from '../dashboardChartsUtils';

class DepositAmountChart extends Component {
  static propTypes = {
    depositPaymentsStatistic: PropTypes.paymentsStatistic.isRequired,
  };

  handleSelectChange = ({ dateFrom, dateTo }) => {
    this.props.depositPaymentsStatistic.refetch({
      dateFrom,
      dateTo,
    });
  };

  render() {
    const { depositPaymentsStatistic } = this.props;

    return (
      <Chart
        title={I18n.t('DASHBOARD.DEPOSITS_AMOUNT_CHART.TITLE')}
        tooltipContent={I18n.t('DASHBOARD.DEPOSITS_AMOUNT_CHART.TOOLTIP_TITLE')}
        data={get(depositPaymentsStatistic, 'statistics.payments.data.items', [])}
        totals={
          mapTotalObject(
            get(depositPaymentsStatistic, 'statistics.payments.data.additionalTotal', {}),
            'amount',
          )
        }
        hasResults={!get(depositPaymentsStatistic, 'statistics.payments.error', {})}
        onSelectChange={this.handleSelectChange}
        selectOptions={getChartSelectOptions}
        loading={get(depositPaymentsStatistic, 'loading')}
        chartAndTextColor="#1565d6"
        lineDataKey="amount"
        withCurrency
      />
    );
  }
}

export default DepositAmountChart;
