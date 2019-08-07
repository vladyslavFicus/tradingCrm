import React, { Component } from 'react';
import { get } from 'lodash';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../constants/propTypes';
import Chart from '../../../../../components/Chart';
import { ChartFooter, getChartSelectOptions } from '../utils';

const chartColor = '#c51d98';

class Registrations extends Component {
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

  handleSelectChange = ({ from: registrationDateFrom, to: registrationDateTo }) => {
    this.props.registeredUsers.refetch({
      registrationDateFrom,
      registrationDateTo,
    });
  };

  render() {
    const {
      registeredUsers: { loading, statistics },
      registeredUsersTotals: { loading: totalsLoading, statistics: totalsStatistics },
    } = this.props;

    const { items } = get(statistics, 'registrations.data') || { items: [] };
    const totals = get(totalsStatistics, 'registrationTotals') || {};

    const error = get(statistics, 'registrations.error', {});

    return (
      <div className="card">
        <div className="card-body chart-card">
          <Chart
            headerTitle={I18n.t('DASHBOARD.REGISTRATION_CHART.TITLE')}
            selectOptions={getChartSelectOptions()}
            onSelectChange={this.handleSelectChange}
            data={items}
            tooltipContent={I18n.t('DASHBOARD.REGISTRATION_CHART.TOOLTIP_TITLE')}
            lines={[
              {
                type: 'monotone',
                dataKey: 'entries',
                stroke: chartColor,
              },
            ]}
            footer={(
              <ChartFooter
                noResults={(!loading && items.length === 0)}
                totals={totals}
                color={chartColor}
              />
            )}
            loading={loading || totalsLoading}
            noResults={!!error}
            noResultsText={I18n.t('DASHBOARD.REGISTRATION_CHART.NO_RESULTS_TEXT')}
          />
        </div>
      </div>
    );
  }
}

export default Registrations;
