import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { get } from 'lodash';
import { I18n } from 'react-redux-i18n';
import Chart from '../../../../components/Chart';
import PropTypes from '../../../../constants/propTypes';
import { departments } from '../../../../constants/brands';
import { registeredUsersQuery } from '../../../../graphql/queries/statistics';
import { ChartFooter, getChartSelectOptions, initialQueryParams } from './utils';

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
    } = this.props;

    const { total, items } = get(statistics, 'registrations.data') || {
      items: [],
    };
    const error = get(statistics, 'registrations.error', {});
    const noResults = !!error || (!loading && items.length === 0);

    return (
      <div className="card">
        <div className="card-body chart-card">
          <Chart
            headerTitle={I18n.t('DASHBOARD.REGISTRATION_CHART.TITLE')}
            selectOptions={getChartSelectOptions()}
            onSelectChange={this.handleSelectChange}
            data={items}
            tooltipСontent={I18n.t('DASHBOARD.REGISTRATION_CHART.TOOLTIP_TITLE')}
            lines={[
              {
                type: 'monotone',
                dataKey: 'entries',
                stroke: chartColor,
              },
            ]}
            footer={
              <ChartFooter
                noResults={noResults}
                total={total}
                color={chartColor}
                title={I18n.t('DASHBOARD.REGISTRATION_CHART.FOOTER_TITLE')}
              />
            }
            loading={loading}
            noResults={noResults}
            noResultsText={I18n.t('DASHBOARD.REGISTRATION_CHART.NO_RESULTS_TEXT')}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  auth: {
    isAdministration: auth.department === departments.ADMINISTRATION,
    hierarchyUsers: auth.hierarchyUsers,
  },
});

export default compose(
  connect(mapStateToProps),
  graphql(registeredUsersQuery, {
    options: ({ auth }) => ({
      variables: {
        ...!auth.isAdministration && { clientIds: get(auth, 'hierarchyUsers.clients') },
        ...initialQueryParams('registrationDateFrom', 'registrationDateTo'),
      },
    }),
    name: 'registeredUsers',
  }),
)(Registrations);
