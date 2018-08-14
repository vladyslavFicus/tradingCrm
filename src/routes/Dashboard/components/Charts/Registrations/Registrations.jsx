import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { graphql } from 'react-apollo';
import { get } from 'lodash';
import { registeredUsersQuery } from '../../../../../graphql/queries/statistics';
import Chart from '../../../../../components/Chart';
import { initialQueryParams } from '../../../constants';
import chartConfig from './chartConfig';
import './Registrations.scss';

const chartFooter = total => (
  <div className="chart-footer">
    <div className="chart-footer__total">
      <div> {I18n.t('DASHBOARD.TOTAL_REGISTERED')}</div>
      <div>{total}</div>
    </div>
  </div>
);

class Registrations extends Component {
  static propTypes = {
    registeredUsers: PropTypes.shape({
      refetch: PropTypes.func.isRequired,
      loading: PropTypes.bool.isRequired,
      statistics: PropTypes.shape({
        registrations: PropTypes.shape({
          data: PropTypes.shape({
            entities: PropTypes.arrayOf(
              PropTypes.shape({
                name: PropTypes.string.isRequired,
                entries: PropTypes.number.isRequired,
              }),
            ).isRequired,
            total: PropTypes.number.isRequired,
          }),
          error: PropTypes.object,
        }).isRequired,
      }),
    }).isRequired,
  };

  handleSelectChange = ({
    from: registrationDateFrom,
    to: registrationDateTo,
  }) => {
    this.props.registeredUsers.refetch({
      registrationDateFrom,
      registrationDateTo,
    });
  };

  render() {
    const {
      registeredUsers: {
        loading,
        statistics,
      },
    } = this.props;

    const { total, entities } = get(statistics, 'registrations.data') || {};

    return (
      <div className="card">
        <div className="card-body chart-card">
          <Chart
            headerTitle={I18n.t('DASHBOARD.REGISTRATIONS')}
            onSelectChange={this.handleSelectChange}
            config={chartConfig(entities)}
            footer={chartFooter(total)}
            loading={loading}
          />
        </div>
      </div>
    );
  }
}

export default graphql(registeredUsersQuery, {
  options: () => ({
    variables: { ...initialQueryParams },
  }),
  name: 'registeredUsers',
})(Registrations);
