import React, { Component } from 'react';
import PropTypes from 'constants/propTypes';
import { get } from 'lodash';
import I18n from 'i18n-js';
import Chart from '../Chart';
import { getChartSelectOptions, mapTotalObject } from '../dashboardChartsUtils';

class WithdrawsAmountChart extends Component {
  static propTypes = {
    withdrawPaymentsStatistic: PropTypes.paymentsStatistic.isRequired,
  };

  handleSelectChange = ({ dateFrom, dateTo }) => {
    this.props.withdrawPaymentsStatistic.refetch({
      dateFrom,
      dateTo,
    });
  };

  render() {
    const { withdrawPaymentsStatistic } = this.props;

    return (
      <Chart
        title={I18n.t('DASHBOARD.WITHDRAWS_AMOUNT_CHART.TITLE')}
        tooltipContent={I18n.t('DASHBOARD.WITHDRAWS_AMOUNT_CHART.TOOLTIP_TITLE')}
        data={get(withdrawPaymentsStatistic, 'statistics.payments.data.items', [])}
        totals={
          mapTotalObject(
            get(withdrawPaymentsStatistic, 'statistics.payments.data.additionalTotal', {}),
            'amount',
          )
        }
        hasResults={!get(withdrawPaymentsStatistic, 'statistics.payments.error', {})}
        onSelectChange={this.handleSelectChange}
        selectOptions={getChartSelectOptions}
        loading={get(withdrawPaymentsStatistic, 'loading')}
        chartAndTextColor="#ff7a21"
        lineDataKey="amount"
        withCurrency
      />
    );
  }
}

export default WithdrawsAmountChart;
