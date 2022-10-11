import React, { PureComponent } from 'react';
import { get } from 'lodash';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { withRequests } from 'apollo';
import Chart from '../Chart';
import { getChartSelectOptions, mapTotalObject } from '../dashboardChartsUtils';
import WithdrawPaymentsStatistic from './graphql/WithdrawPaymentsStatistic';

class WithdrawsAmountChart extends PureComponent {
  static propTypes = {
    withdrawPaymentsStatistic: PropTypes.paymentsStatistic.isRequired,
  };

  handleSelectChange = ({ dateFrom, dateTo }) => {
    this.props.withdrawPaymentsStatistic.refetch({
      dateFrom,
      dateTo,
    });
  };

  tooltipAmountFormatter = value => I18n.toCurrency(value, { unit: '' });

  render() {
    const { withdrawPaymentsStatistic } = this.props;

    return (
      <Chart
        title={I18n.t('DASHBOARD.WITHDRAWS_AMOUNT_CHART.TITLE')}
        tooltipContent={I18n.t('DASHBOARD.WITHDRAWS_AMOUNT_CHART.TOOLTIP_TITLE')}
        tooltipAmountFormatter={this.tooltipAmountFormatter}
        data={get(withdrawPaymentsStatistic, 'data.paymentsStatistic.items', [])}
        totals={
          mapTotalObject(
            get(withdrawPaymentsStatistic, 'data.paymentsStatistic.additionalTotal', {}),
            'amount',
          )
        }
        hasResults={!get(withdrawPaymentsStatistic, 'error') || true}
        onSelectChange={this.handleSelectChange}
        selectOptions={getChartSelectOptions}
        loading={withdrawPaymentsStatistic.loading}
        chartAndTextColor="var(--state-colors-warning)"
        lineDataKey="amount"
        xDataKey="entryDate"
        withCurrency
      />
    );
  }
}

export default withRequests({
  withdrawPaymentsStatistic: WithdrawPaymentsStatistic,
})(WithdrawsAmountChart);
