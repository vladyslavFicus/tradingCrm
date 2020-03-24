import React, { Component } from 'react';
import PropTypes from 'constants/propTypes';
import { get } from 'lodash';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import Chart from '../Chart';
import { getChartSelectOptions, mapTotalObject } from '../dashboardChartsUtils';
import DepositPaymentsStatistic from './graphql/DepositPaymentsStatistic';

class DepositCountChart extends Component {
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
        title={I18n.t('DASHBOARD.DEPOSITS_COUNT_CHART.TITLE')}
        tooltipContent={I18n.t('DASHBOARD.DEPOSITS_COUNT_CHART.TOOLTIP_TITLE')}
        data={get(depositPaymentsStatistic, 'data.statistics.payments.data.items', [])}
        totals={
          mapTotalObject(
            get(depositPaymentsStatistic, 'data.statistics.payments.data.additionalTotal', {}),
            'count',
          )
        }
        hasResults={!get(depositPaymentsStatistic, 'data.statistics.payments.error', {})}
        onSelectChange={this.handleSelectChange}
        selectOptions={getChartSelectOptions}
        loading={depositPaymentsStatistic.loading}
        chartAndTextColor="#1565d6"
        xDataKey="entryDate"
        lineDataKey="count"
      />
    );
  }
}

export default withRequests({
  depositPaymentsStatistic: DepositPaymentsStatistic,
})(DepositCountChart);
