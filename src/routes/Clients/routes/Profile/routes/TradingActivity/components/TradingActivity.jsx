import React, { Component, Fragment } from 'react';
import { get } from 'lodash';
import I18n from 'i18n-js';
import EventEmitter, { PROFILE_RELOAD } from 'utils/EventEmitter';
import PropTypes from 'constants/propTypes';
import Grid, { GridColumn } from 'components/Grid';
import TabHeader from 'components/TabHeader';
import FilterFields from './FilterFields';
import { columns } from '../attributes/constants';

class TradingActivity extends Component {
  static propTypes = {
    tradingActivity: PropTypes.query(PropTypes.pageable(PropTypes.tradingActivity)).isRequired,
    modals: PropTypes.shape({
      changeOriginalAgentModal: PropTypes.modalType,
    }).isRequired,
  };

  componentDidMount() {
    EventEmitter.on(PROFILE_RELOAD, this.onProfileEvent);
  }

  componentWillUnmount() {
    EventEmitter.off(PROFILE_RELOAD, this.onProfileEvent);
  }

  onProfileEvent = () => {
    this.props.tradingActivity.refetch();
  };

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

  showChangeOriginalAgentModal = (tradeId, agentId, platformType) => {
    const { tradingActivity, modals: { changeOriginalAgentModal } } = this.props;

    changeOriginalAgentModal.show({
      tradeId,
      agentId,
      platformType,
      onSuccess: tradingActivity.refetch,
    });
  }

  render() {
    const {
      tradingActivity,
      tradingActivity: { loading },
    } = this.props;

    const clientTradingActivity = get(tradingActivity, 'clientTradingActivity.data') || { content: [] };
    const error = get(tradingActivity, 'clientTradingActivity.error');

    return (
      <Fragment>
        <TabHeader title={I18n.t('CONSTANTS.TRANSACTIONS.ROUTES.TRADING_ACTIVITY')} />
        <FilterFields />
        <div className="tab-wrapper">
          <Grid
            data={clientTradingActivity.content}
            handlePageChanged={this.handlePageChanged}
            isLoading={loading}
            isLastPage={clientTradingActivity.last}
            withLazyLoad
            withNoResults={!!error || (!loading && clientTradingActivity.totalElements === 0)}
          >
            {columns(this.showChangeOriginalAgentModal).map(({ name, header, render }) => (
              <GridColumn
                key={name}
                name={name}
                header={header}
                render={render}
              />
            ))}
          </Grid>
        </div>
      </Fragment>
    );
  }
}

export default TradingActivity;
