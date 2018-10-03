import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { I18n } from 'react-redux-i18n';
import { tradingActivityQuery } from '../../../../../../../../../graphql/queries/tradingActivity';
import GridView, { GridViewColumn } from '../../../../../../../../../components/GridView';
import FilterForm from './FilterForm';
import { columns } from '../constants';

class TradingActivity extends Component {
  static propTypes = {
    locale: PropTypes.string.isRequired,
    playerProfile: PropTypes.shape({
      playerProfile: PropTypes.object,
    }),
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    playerProfile: {},
  };

  state = {
    tradingActivity: {},
    mt4Accs: [],
  }

  componentWillMount() {
    const { playerProfile: { playerProfile } } = this.props;

    if (this.props.playerProfile.playerProfile) {
      const mt4Accs = get(playerProfile, 'data.tradingProfile.mt4Users') || [];
      const loginIds = mt4Accs.map(item => item.login);

      this.getTradingActivity({ loginIds });
      this.setState({
        mt4Accs,
      });
    }
  }

  componentWillReceiveProps = async (nextProps) => {
    const { playerProfile: { playerProfile } } = this.props;
    const { playerProfile: { playerProfile: nextPlayerProfile } } = nextProps;
    if (!playerProfile && nextPlayerProfile) {
      const mt4Accs = get(nextPlayerProfile, 'data.tradingProfile.mt4Users') || [];
      const loginIds = mt4Accs.map(item => item.login);

      this.getTradingActivity({ loginIds });
      this.setState({
        mt4Accs,
      });
    }
  }

  getTradingActivity = async (variables) => {
    const { mt4Accs } = this.state;
    const tradingActivity = await this.props.client.query({
      query: tradingActivityQuery,
      variables: {
        ...variables,
        ...(variables.loginIds && variables.loginIds.length > 0
          ? { loginIds: variables.loginIds }
          : { loginIds: mt4Accs.map(item => item.login) }),
      },
    });

    this.setState({
      tradingActivity,
    });
  };

  handlePageChanged = () => {
    // need data to make this working
  };

  handleApplyFilters = (variables) => {
    this.getTradingActivity(variables);
  };

  render() {
    const {
      locale,
    } = this.props;

    const {
      tradingActivity,
      mt4Accs,
    } = this.state;

    const clientTradingActivity = get(tradingActivity, 'data.clientTradingActivity') || {};

    return (
      <Fragment>
        <FilterForm
          onSubmit={this.handleApplyFilters}
          accounts={mt4Accs}
        />
        <If condition={tradingActivity.loading !== undefined && !tradingActivity.loading}>
          <div className="tab-wrapper">
            <GridView
              dataSource={clientTradingActivity.content}
              onPageChange={this.handlePageChanged}
              activePage={clientTradingActivity.number + 1}
              totalPages={clientTradingActivity.totalPages}
              lazyLoad
              locale={locale}
              showNoResults={clientTradingActivity.totalElements === 0}
            >
              { columns(I18n).map(({ name, header, render }) => (
                <GridViewColumn
                  key={name}
                  name={name}
                  header={header}
                  render={render}
                />
              ))}
            </GridView>
          </div>
        </If>
      </Fragment>
    );
  }
}

export default TradingActivity;
