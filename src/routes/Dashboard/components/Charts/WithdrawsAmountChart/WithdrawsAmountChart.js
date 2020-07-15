import React, { PureComponent } from 'react';
import PropTypes from 'constants/propTypes';
import { get } from 'lodash';
import I18n from 'i18n-js';
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

  render() {
    const { withdrawPaymentsStatistic } = this.props;

    return (
      <Chart
        title={I18n.t('DASHBOARD.WITHDRAWS_AMOUNT_CHART.TITLE')}
        tooltipContent={I18n.t('DASHBOARD.WITHDRAWS_AMOUNT_CHART.TOOLTIP_TITLE')}
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
        chartAndTextColor="#ff7a21"
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
