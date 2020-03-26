import React, { Component, Fragment } from 'react';
import { get } from 'lodash';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import Grid, { GridColumn } from 'components/Grid';
import TabHeader from 'components/TabHeader';
import FilterFields from './FilterFields';
import { columns } from '../attributes/constants';

class TradingActivity extends Component {
  static propTypes = {
    tradingActivity: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      clientTradingActivity: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.tradingActivity),
      }),
    }).isRequired,
    modals: PropTypes.shape({
      changeOriginalAgentModal: PropTypes.modalType,
    }).isRequired,
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

  showChangeOriginalAgentModal = (tradeId, agentId) => {
    const { tradingActivity, modals: { changeOriginalAgentModal } } = this.props;

    changeOriginalAgentModal.show({
      tradeId,
      agentId,
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
