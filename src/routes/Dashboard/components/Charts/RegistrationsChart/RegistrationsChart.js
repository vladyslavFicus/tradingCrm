import React, { PureComponent } from 'react';
import PropTypes from 'constants/propTypes';
import { get } from 'lodash';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import RegisteredUsersStatistic from './graphql/RegisteredUsersStatistic';
import Chart from '../Chart';
import { getChartSelectOptions } from '../dashboardChartsUtils';

class RegistrationsChart extends PureComponent {
  static propTypes = {
    registeredUsersStatistic: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      refetch: PropTypes.func.isRequired,
      statistics: PropTypes.shape({
        registrationStatistic: PropTypes.shape({
          data: PropTypes.shape({
            additionalStatistics: PropTypes.shape({
              total: PropTypes.RegisteredUsersAdditionalStatField,
              month: PropTypes.RegisteredUsersAdditionalStatField,
              today: PropTypes.RegisteredUsersAdditionalStatField,
            }),
            registrations: PropTypes.arrayOf(PropTypes.chartEntity).isRequired,
          }),
          error: PropTypes.bool,
        }),
      }),
    }).isRequired,
  };

  handleSelectChange = ({ dateFrom, dateTo }) => {
    this.props.registeredUsersStatistic.refetch({
      dateFrom,
      dateTo,
    });
  };

  render() {
    const {
      registeredUsersStatistic,
    } = this.props;

    return (
      <Chart
        title={I18n.t('DASHBOARD.REGISTRATION_CHART.TITLE')}
        tooltipContent={I18n.t('DASHBOARD.REGISTRATION_CHART.TOOLTIP_TITLE')}
        data={get(registeredUsersStatistic, 'data.statistics.registrationStatistic.data.registrations', [])}
        totals={get(registeredUsersStatistic, 'data.statistics.registrationStatistic.data.additionalStatistics', {})}
        hasResults={!get(registeredUsersStatistic, 'data.statistics.registrationStatistic.error', {})}
        onSelectChange={this.handleSelectChange}
        selectOptions={getChartSelectOptions}
        loading={registeredUsersStatistic.loading}
        chartAndTextColor="#c51d98"
        lineDataKey="entries"
        xDataKey="entryDate"
      />
    );
  }
}

export default withRequests({
  registeredUsersStatistic: RegisteredUsersStatistic,
})(RegistrationsChart);
