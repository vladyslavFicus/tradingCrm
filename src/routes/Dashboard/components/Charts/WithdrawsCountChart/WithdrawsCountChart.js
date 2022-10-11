import React, { PureComponent } from 'react';
import { get } from 'lodash';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { withRequests } from 'apollo';
import Chart from '../Chart';
import { getChartSelectOptions, mapTotalObject } from '../dashboardChartsUtils';
import WithdrawPaymentsStatistic from './graphql/WithdrawPaymentsStatistic';

class WithdrawsCountChart extends PureComponent {
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
        title={I18n.t('DASHBOARD.WITHDRAWS_COUNT_CHART.TITLE')}
        tooltipContent={I18n.t('DASHBOARD.WITHDRAWS_COUNT_CHART.TOOLTIP_TITLE')}
        data={get(withdrawPaymentsStatistic, 'data.paymentsStatistic.items', [])}
        totals={
          mapTotalObject(
            get(withdrawPaymentsStatistic, 'data.paymentsStatistic.additionalTotal', {}),
            'count',
          )
        }
        hasResults={!get(withdrawPaymentsStatistic, 'error') || true}
        onSelectChange={this.handleSelectChange}
        selectOptions={getChartSelectOptions}
        loading={withdrawPaymentsStatistic.loading}
        chartAndTextColor="var(--state-colors-warning)"
        xDataKey="entryDate"
        lineDataKey="count"
      />
    );
  }
}

export default withRequests({
  withdrawPaymentsStatistic: WithdrawPaymentsStatistic,
})(WithdrawsCountChart);
