import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import PropTypes from '../../../../../../../../constants/propTypes';
import GridView, { GridColumn } from '../../../../../../../../components/GridView';
import Uuid from '../../../../../../../../components/Uuid';
import renderLabel from '../../../../../../../../utils/renderLabel';
import { campaignTypesLabels, targetTypesLabels } from '../../../../../../../../constants/bonus-campaigns';
import IframeLink from '../../../../../../../../components/IframeLink';
import BonusHeaderNavigation from '../../../../components/BonusHeaderNavigation';
import Amount from "../../../../../../../../components/Amount/Amount";

class View extends Component {
  static propTypes = {
    list: PropTypes.shape({
      entities: PropTypes.arrayOf(PropTypes.freeSpinEntity),
    }).isRequired,
    currency: PropTypes.string.isRequired,
    fetchFreeSpins: PropTypes.func.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  };

  componentDidMount() {
    this.props.fetchFreeSpins(this.props.params.id);
  }

  handlePageChanged = (page) => {
    this.setState({ page: page - 1 }, () => this.handleRefresh());
  };

  handleRefresh = () => this.props.fetchFreeSpins({
    ...this.state.filters,
    page: this.state.page,
    playerUUID: this.props.params.id,
  });

  renderFreeSpin = data => (
    <div>
      <div className="font-weight-700">
        {data.name}
      </div>
      <div className="font-size-10">
        <Uuid uuid={data.uuid} />
      </div>
      <div className="font-size-10">
        <Uuid uuid={data.authorUuid} />
      </div>
    </div>
  );

  renderAvailable = data => (
    <div>
      <div className="font-weight-700">
        {moment.utc(data.startDate).local().format('DD.MM.YYYY HH:mm')}
      </div>
      <div className="font-size-10">
        {I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.DATE_TO', {
          time: moment.utc(data.endDate).local().format('DD.MM.YYYY HH:mm'),
        })}
      </div>
    </div>
  );

  renderGranted = data => {
    const { currency } = this.props;

    return (
      <div>
        <div className="font-weight-700">
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.FREE_SPIN_COUNT', { count: data.freeSpinsAmount })}
        </div>
        <div className="font-size-10">
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.SPIN_VALUE')}:&nbsp;
          <Amount currency={currency} amount={data.spinValue} />
        </div>
        <div className="font-size-10">
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.TOTAL_VALUE')}:&nbsp;
          <Amount currency={currency} amount={data.totalValue} />
        </div>
      </div>
    );
  };

  render() {
    const { list: { entities } } = this.props;

    return (
      <div className="tab-pane fade in active profile-tab-container">
        <div className="row margin-bottom-20">
          <div className="col-md-6 col-xs-6">
            <BonusHeaderNavigation />
          </div>
        </div>

        <GridView
          tableClassName="table table-hovered data-grid-layout"
          headerClassName=""
          dataSource={entities.content}
          onPageChange={this.handlePageChanged}
          activePage={entities.number + 1}
          totalPages={entities.totalPages}
        >
          <GridColumn
            name="freeSpin"
            header={I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.FREE_SPIN')}
            headerClassName="text-uppercase"
            render={this.renderFreeSpin}
          />
          <GridColumn
            name="availability"
            header={I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.AVAILABILITY')}
            headerClassName="text-uppercase"
            render={this.renderAvailable}
          />
          <GridColumn
            name="availability"
            header={I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.GRANTED')}
            headerClassName="text-uppercase"
            render={this.renderAvailable}
          />
        </GridView>
      </div>
    );
  }
}

export default View;
