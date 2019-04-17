import React, { Component, Fragment } from 'react';
import { get } from 'lodash';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'constants/propTypes';
import GridView, { GridViewColumn } from 'components/GridView';
import TabHeader from 'components/TabHeader';
import history from 'router/history';
import FilterForm from './FilterForm';
import { columns } from '../constants';

class TradingActivity extends Component {
  static propTypes = {
    locale: PropTypes.string.isRequired,
    playerProfile: PropTypes.shape({
      playerProfile: PropTypes.object,
    }),
    tradingActivity: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      clientTradingActivity: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.tradingActivity),
      }),
    }).isRequired,
  };

  static defaultProps = {
    playerProfile: {},
  };

  componentWillUnmount() {
    this.handleFilterReset();
  }

  handlePageChanged = () => {
    const {
      tradingActivity: {
        loadMore,
        loading,
      },
    } = this.props;

    if (!loading) {
      loadMore();
    }
  };

  handleFilterReset = () => {
    const { playerProfile } = this.props;
    const loginIds = get(playerProfile, 'playerProfile.data.tradingProfile.mt4Users') || [];

    history.replace({ query: { filters: { loginIds: loginIds.map(({ login }) => login) } } });
  }

  handleFiltersChanged = (filters = {}) => {
    const { playerProfile } = this.props;
    const loginIds = get(playerProfile, 'playerProfile.data.tradingProfile.mt4Users') || [];

    history.replace({
      query: {
        filters: {
          ...filters,
          ...filters.loginIds
            ? { loginIds: filters.loginIds }
            : { loginIds: loginIds.map(({ login }) => login) },
        },
      },
    });
  }

  render() {
    const {
      locale,
      tradingActivity,
      tradingActivity: { loading },
      playerProfile,
      playerProfile: { loading: profileLoading },
    } = this.props;

    const clientTradingActivity = get(tradingActivity, 'clientTradingActivity.data') || { content: [] };
    const mt4Accs = get(playerProfile, 'playerProfile.data.tradingProfile.mt4Users') || [];

    const profileError = get(playerProfile, 'playerProfile.error');
    const error = get(tradingActivity, 'clientTradingActivity.error');

    return (
      <Fragment>
        <TabHeader title={I18n.t('CONSTANTS.TRANSACTIONS.ROUTES.TRADING_ACTIVITY')} />
        <FilterForm
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          disabled={profileError || profileLoading}
          accounts={mt4Accs}
        />
        <div className="tab-wrapper">
          <GridView
            dataSource={clientTradingActivity.content}
            onPageChange={this.handlePageChanged}
            last={clientTradingActivity.last}
            locale={locale}
            showNoResults={error || (!loading && clientTradingActivity.totalElements === 0)}
            lazyLoad
          >
            {columns(I18n).map(({ name, header, render }) => (
              <GridViewColumn
                key={name}
                name={name}
                header={header}
                render={render}
              />
            ))}
          </GridView>
        </div>
      </Fragment>
    );
  }
}

export default TradingActivity;
