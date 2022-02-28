import React, { PureComponent } from 'react';
import { get } from 'lodash';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { withRequests } from 'apollo';
import Chart from '../Chart';
import { getChartSelectOptions } from '../dashboardChartsUtils';
import RegisteredUsersStatistic from './graphql/RegisteredUsersStatistic';

class RegistrationsChart extends PureComponent {
  static propTypes = {
    registeredUsersStatistic: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      refetch: PropTypes.func.isRequired,
      registrationStatistic: PropTypes.shape({
        additionalStatistics: PropTypes.shape({
          total: PropTypes.RegisteredUsersAdditionalStatField,
          month: PropTypes.RegisteredUsersAdditionalStatField,
          today: PropTypes.RegisteredUsersAdditionalStatField,
        }),
        registrations: PropTypes.arrayOf(PropTypes.chartEntity).isRequired,
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
    const { registeredUsersStatistic } = this.props;

    return (
      <Chart
        title={I18n.t('DASHBOARD.REGISTRATION_CHART.TITLE')}
        tooltipContent={I18n.t('DASHBOARD.REGISTRATION_CHART.TOOLTIP_TITLE')}
        data={get(registeredUsersStatistic, 'data.registrationStatistic.registrations', [])}
        totals={get(registeredUsersStatistic, 'data.registrationStatistic.additionalStatistics', {})}
        hasResults={!get(registeredUsersStatistic, 'error') || true}
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
