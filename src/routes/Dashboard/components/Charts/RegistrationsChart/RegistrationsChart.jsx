import React, { Component } from 'react';
import PropTypes from 'constants/propTypes';
import { get } from 'lodash';
import I18n from 'i18n-js';
import Chart from '../Chart';
import { getChartSelectOptions } from '../dashboardChartsUtils';

class RegistrationsChart extends Component {
  static propTypes = {
    registeredUsers: PropTypes.shape({
      refetch: PropTypes.func.isRequired,
      loading: PropTypes.bool.isRequired,
      statistics: PropTypes.shape({
        registrations: PropTypes.shape({
          data: PropTypes.shape({
            items: PropTypes.arrayOf(PropTypes.chartEntity).isRequired,
            total: PropTypes.number.isRequired,
          }),
          error: PropTypes.object,
        }).isRequired,
      }),
    }).isRequired,
    registeredUsersTotals: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      statistics: PropTypes.shape({
        registrationTotals: PropTypes.shape({
          total: PropTypes.chartTotal.isRequired,
          month: PropTypes.chartTotal.isRequired,
          today: PropTypes.chartTotal.isRequired,
        }),
      }),
    }).isRequired,
  };

  handleSelectChange = ({ dateFrom, dateTo }) => {
    this.props.registeredUsers.refetch({
      dateFrom,
      dateTo,
    });
  };

  render() {
    const {
      registeredUsers,
      registeredUsersTotals,
    } = this.props;

    return (
      <Chart
        title={I18n.t('DASHBOARD.REGISTRATION_CHART.TITLE')}
        tooltipContent={I18n.t('DASHBOARD.REGISTRATION_CHART.TOOLTIP_TITLE')}
        data={get(registeredUsers, 'statistics.registrations.data.items', [])}
        totals={get(registeredUsersTotals, 'statistics.registrationTotals', {})}
        hasResults={!get(registeredUsers, 'statistics.registrations.error', {})}
        onSelectChange={this.handleSelectChange}
        selectOptions={getChartSelectOptions}
        loading={get(registeredUsers, 'loading')}
        chartAndTextColor="#c51d98"
        lineDataKey="entries"
      />
    );
  }
}

export default RegistrationsChart;
